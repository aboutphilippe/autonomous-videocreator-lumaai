"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createVideo = createVideo;
const workflow_1 = require("@restackio/restack-sdk-ts/workflow");
const taskQueue_1 = require("@restackio/integrations-azurespeech/taskQueue");
const taskQueue_2 = require("@restackio/integrations-lumaai/taskQueue");
const taskQueue_3 = require("@restackio/integrations-openai/taskQueue");
function createVideo(_a) {
    return __awaiter(this, arguments, void 0, function* ({ title, prompt, fromImageUrl, playlistId, serieId, uploadToYoutube, userId, }) {
        var _b;
        const resultPromptVideo = yield (0, workflow_1.step)({
            taskQueue: taskQueue_3.openaiTaskQueue,
        }).openaiChatCompletionsBase({
            userContent: `
    I want to prompt a text to video model to make a 15s video ad.
    Make it short and concise. Just give me the prompt for lumaai ${prompt}`,
        });
        const videoPrompt = resultPromptVideo.result.choices[0].message.content;
        if (!videoPrompt) {
            throw new Error("No video prompt");
        }
        const resultPromptAudio = yield (0, workflow_1.step)({
            taskQueue: taskQueue_3.openaiTaskQueue,
        }).openaiChatCompletionsBase({
            userContent: `
      Make the text for the voiceover of a video. 
      It needs to be 13s long so make it short and concise.
      This reponse is used by text to speech, make it as natural as possible.
      Make it sounds like David Attenborough describing the scene "${videoPrompt}".
      Only output the text, no intro, no outro, no hashtags, no emojis, no nothing.
    `,
        });
        const audioPrompt = resultPromptAudio.result.choices[0].message.content;
        if (!audioPrompt) {
            throw new Error("No audio prompt");
        }
        yield (0, workflow_1.step)({}).supabaseUpsertVideo({
            video: {
                series_id: serieId,
                title: title,
                description: audioPrompt,
                status: "NEW",
                thumbnail_url: fromImageUrl !== null && fromImageUrl !== void 0 ? fromImageUrl : "",
            },
        });
        const { media: audio } = yield (0, workflow_1.step)({
            taskQueue: taskQueue_1.azureSpeechTaskQueue,
        }).azureSpeech({
            text: audioPrompt,
            config: {
                voiceName: "en-US-DavisNeural",
                format: 22,
            },
        });
        workflow_1.log.info("audio", { audio });
        let lastVideoUrl;
        let previousGenerationId;
        const { publicUrl } = yield (0, workflow_1.step)({
            taskQueue: "gcp",
        }).uploadImageToBucket({
            imageUrl: fromImageUrl,
        });
        for (let i = 0; i < 4; i++) {
            const { generation: queuedGeneration } = yield (0, workflow_1.step)({
                taskQueue: taskQueue_2.lumaaiTaskQueue,
            }).lumaaiGenerate({
                prompt: `${prompt}.
        Make it look epic with a slow motion effect and with a low angle.`,
                aspectRatio: "9:16",
                extendGenerationId: previousGenerationId,
                fromImageUrl: previousGenerationId ? undefined : publicUrl,
                loop: true,
            });
            workflow_1.log.info(`queuedGeneration ${i + 1}`, { queuedGeneration });
            let video;
            if (queuedGeneration === null || queuedGeneration === void 0 ? void 0 : queuedGeneration.id) {
                while (!video || video.state !== "completed") {
                    const { generation } = yield (0, workflow_1.step)({
                        taskQueue: taskQueue_2.lumaaiTaskQueue,
                    }).lumaaiGetGeneration({
                        generationId: queuedGeneration === null || queuedGeneration === void 0 ? void 0 : queuedGeneration.id,
                    });
                    video = generation;
                    yield (0, workflow_1.sleep)(60000);
                }
                workflow_1.log.info(`generation ${i + 1}`, { video });
                lastVideoUrl = (_b = video === null || video === void 0 ? void 0 : video.assets) === null || _b === void 0 ? void 0 : _b.video;
                previousGenerationId = queuedGeneration.id;
            }
        }
        if (lastVideoUrl) {
            const { outputPath } = yield (0, workflow_1.step)({}).mergeMedia({
                videoUrl: lastVideoUrl,
                generationId: previousGenerationId,
                audioBase64: audio.payload,
            });
            const { publicUrl: videoUrl } = yield (0, workflow_1.step)({
                taskQueue: "gcp",
            }).uploadVideoToBucket({
                outputPath,
            });
            if (uploadToYoutube && userId) {
                const { accessToken, refreshToken } = yield (0, workflow_1.step)({
                    taskQueue: "supabase",
                }).supabaseGetProfileTokens({
                    userId,
                });
                const youtubeVideo = yield (0, workflow_1.step)({
                    taskQueue: "youtube-upload",
                }).youtubeUpload({
                    title,
                    description: audioPrompt,
                    filePath: outputPath,
                    accessToken,
                    refreshToken,
                });
                if (playlistId) {
                    yield (0, workflow_1.step)({
                        taskQueue: "youtube",
                    }).youtubeAddVideoToPlaylist({
                        videoId: youtubeVideo.videoId,
                        playlistId,
                        accessToken,
                        refreshToken,
                    });
                }
                return {
                    serieId,
                    playlistId,
                    title,
                    description: audioPrompt,
                    thumbnailUrl: fromImageUrl,
                    videoUrl: videoUrl,
                    status: "PUBLISHED",
                    youtubeVideo,
                };
            }
            return {
                serieId,
                playlistId,
                title,
                description: audioPrompt,
                thumbnailUrl: fromImageUrl,
                status: "DRAFT",
                videoUrl: videoUrl,
            };
        }
    });
}
