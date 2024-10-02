import { log, step, sleep } from "@restackio/restack-sdk-ts/workflow";
import * as functions from "../functions";
import { azureSpeechTaskQueue } from "@restackio/integrations-azurespeech/taskQueue";
import * as azureSpeechFunctions from "@restackio/integrations-azurespeech/functions";
import { lumaaiTaskQueue } from "@restackio/integrations-lumaai/taskQueue";
import * as lumaaiFunctions from "@restackio/integrations-lumaai/functions";
import { openaiTaskQueue } from "@restackio/integrations-openai/taskQueue";
import * as openaiFunctions from "@restackio/integrations-openai/functions";

interface Input {
  title: string;
  prompt: string;
  fromImageUrl?: string;
  playlistId?: string;
  seriesId?: string;
  uploadToYoutube?: boolean;
  accessToken?: string;
  refreshToken?: string;
}

export async function createVideo({
  title,
  prompt,
  fromImageUrl,
  playlistId,
  seriesId,
  uploadToYoutube,
  accessToken,
  refreshToken,
}: Input) {
  const resultPromptVideo = await step<typeof openaiFunctions>({
    taskQueue: openaiTaskQueue,
  }).openaiChatCompletionsBase({
    userContent: `
    I want to prompt a text to video model to make a 15s video ad.
    Make it short and concise. Just give me the prompt for lumaai ${prompt}`,
  });

  const videoPrompt = resultPromptVideo.result.choices[0].message.content;

  if (!videoPrompt) {
    throw new Error("No video prompt");
  }

  const resultPromptAudio = await step<typeof openaiFunctions>({
    taskQueue: openaiTaskQueue,
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

  const { media: audio } = await step<typeof azureSpeechFunctions>({
    taskQueue: azureSpeechTaskQueue,
  }).azureSpeech({
    text: audioPrompt,
    config: {
      voiceName: "en-US-DavisNeural",
      format: 22,
    },
  });

  log.info("audio", { audio });

  let lastVideoUrl: string | undefined;
  let previousGenerationId: string | undefined;

  const { publicUrl } = await step<typeof functions>({
    taskQueue: "gcp",
  }).uploadImageToBucket({
    imageUrl: fromImageUrl!,
  });

  for (let i = 0; i < 4; i++) {
    const { generation: queuedGeneration } = await step<typeof lumaaiFunctions>(
      {
        taskQueue: lumaaiTaskQueue,
      }
    ).lumaaiGenerate({
      prompt: `${prompt}.
        Make it look epic with a slow motion effect and with a low angle.`,
      aspectRatio: "9:16",
      extendGenerationId: previousGenerationId,
      fromImageUrl: previousGenerationId ? undefined : publicUrl,
      loop: true,
    });

    log.info(`queuedGeneration ${i + 1}`, { queuedGeneration });

    let video;
    if (queuedGeneration?.id) {
      while (!video || video.state !== "completed") {
        const { generation } = await step<typeof lumaaiFunctions>({
          taskQueue: lumaaiTaskQueue,
        }).lumaaiGetGeneration({
          generationId: queuedGeneration?.id,
        });
        video = generation;
        await sleep(60000);
      }

      log.info(`generation ${i + 1}`, { video });
      lastVideoUrl = video?.assets?.video!;
      previousGenerationId = queuedGeneration.id;
    }
  }

  if (lastVideoUrl) {
    const { outputPath } = await step<typeof functions>({}).mergeVideos({
      videoUrl: lastVideoUrl,
      generationId: previousGenerationId!,
      audioBase64: audio.payload,
    });

    const { publicUrl: videoUrl } = await step<typeof functions>({
      taskQueue: "gcp",
    }).uploadVideoToBucket({
      outputPath,
    });

    if (uploadToYoutube && accessToken && refreshToken) {
      const youtubeVideo = await step<typeof functions>({
        taskQueue: "youtube-upload",
      }).youtubeUpload({
        title,
        description: audioPrompt,
        filePath: outputPath,
        accessToken,
        refreshToken,
      });

      if (playlistId) {
        await step<typeof functions>({
          taskQueue: "youtube",
        }).youtubeAddVideoToPlaylist({
          videoId: youtubeVideo.videoId,
          playlistId,
          accessToken,
          refreshToken,
        });
      }

      return {
        seriesId,
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
      seriesId,
      playlistId,
      title,
      description: audioPrompt,
      thumbnailUrl: fromImageUrl,
      status: "DRAFT",
      videoUrl: videoUrl,
    };
  }
}
