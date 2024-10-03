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
exports.launchSerie = launchSerie;
const workflow_1 = require("@restackio/restack-sdk-ts/workflow");
const createVideo_1 = require("./createVideo");
function launchSerie(_a) {
    return __awaiter(this, arguments, void 0, function* ({ userId, serieId, createPlaylist }) {
        const { serie } = yield (0, workflow_1.step)({
            taskQueue: "supabase",
        }).supabaseGetSerie({
            serieId,
        });
        if (createPlaylist) {
            const { accessToken, refreshToken } = yield (0, workflow_1.step)({
                taskQueue: "supabase",
            }).supabaseGetProfileTokens({
                userId,
            });
            const playlistId = yield (0, workflow_1.step)({
                taskQueue: "youtube",
            }).youtubeCreatePlaylist({
                title: serie.title,
                description: serie.description,
                accessToken,
                refreshToken,
            });
            yield (0, workflow_1.step)({
                taskQueue: "supabase",
            }).supabaseUpdateSerie({
                serieId,
                status: "LIVE",
                playlistId,
            });
        }
        else {
            yield (0, workflow_1.step)({
                taskQueue: "supabase",
            }).supabaseUpdateSerie({
                serieId,
                status: "LIVE",
            });
        }
        const videos = yield Promise.all(serie.images.map((image) => __awaiter(this, void 0, void 0, function* () {
            const childWorkflow = yield (0, workflow_1.startChild)(createVideo_1.createVideo, {
                args: [
                    {
                        userId,
                        serieId,
                        title: image.title,
                        prompt: image.prompt,
                        fromImageUrl: image.url,
                        playlistId: serie.playlistId,
                        uploadToYoutube: false,
                    },
                ],
                workflowId: `${image.id}-createVideo`,
            });
            return Object.assign(Object.assign({}, videos), { videos: childWorkflow.firstExecutionRunId });
        })));
        return {
            videos,
        };
    });
}
