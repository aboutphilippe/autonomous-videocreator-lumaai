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
exports.youtubeAddVideoToPlaylist = youtubeAddVideoToPlaylist;
exports.youtubeCreatePlaylist = youtubeCreatePlaylist;
const googleapis_1 = require("googleapis");
const auth_1 = require("./auth");
function youtubeAddVideoToPlaylist(_a) {
    return __awaiter(this, arguments, void 0, function* ({ videoId, playlistId, accessToken, refreshToken, }) {
        const auth = (0, auth_1.getAuthClient)(accessToken, refreshToken);
        const youtube = googleapis_1.google.youtube({
            version: "v3",
            auth,
        });
        const playlistItem = yield youtube.playlistItems.insert({
            part: ["snippet"],
            requestBody: {
                snippet: {
                    playlistId,
                    resourceId: {
                        kind: "youtube#video",
                        videoId,
                    },
                },
            },
        });
        return playlistItem;
    });
}
function youtubeCreatePlaylist(_a) {
    return __awaiter(this, arguments, void 0, function* ({ title, description, accessToken, refreshToken, }) {
        const auth = (0, auth_1.getAuthClient)(accessToken, refreshToken);
        const youtube = googleapis_1.google.youtube({
            version: "v3",
            auth,
        });
        const res = yield youtube.playlists.insert({
            part: ["snippet", "status"],
            requestBody: {
                snippet: {
                    title,
                    description,
                },
                status: {
                    privacyStatus: "public",
                },
            },
        });
        const playlistId = res.data.id;
        return playlistId;
    });
}
