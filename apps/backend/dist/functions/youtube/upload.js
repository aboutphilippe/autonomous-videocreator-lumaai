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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.youtubeUpload = youtubeUpload;
const fs_1 = __importDefault(require("fs"));
const readline_1 = __importDefault(require("readline"));
const googleapis_1 = require("googleapis");
const auth_1 = require("./auth");
function youtubeUpload(_a) {
    return __awaiter(this, arguments, void 0, function* ({ title, description, filePath, accessToken, refreshToken, }) {
        const fileSize = fs_1.default.statSync(filePath).size;
        const auth = (0, auth_1.getAuthClient)(accessToken, refreshToken);
        const youtube = googleapis_1.google.youtube({
            version: "v3",
            auth,
        });
        const res = yield youtube.videos.insert({
            part: ["id", "snippet", "status"],
            notifySubscribers: false,
            requestBody: {
                snippet: {
                    title,
                    description,
                },
                status: {
                    embeddable: true,
                    privacyStatus: "private",
                    madeForKids: true,
                    selfDeclaredMadeForKids: true,
                    publicStatsViewable: true,
                },
            },
            media: {
                body: fs_1.default.createReadStream(filePath),
            },
        }, {
            onUploadProgress: (evt) => {
                const progress = (evt.bytesRead / fileSize) * 100;
                readline_1.default.clearLine(process.stdout, 0);
                readline_1.default.cursorTo(process.stdout, 0, undefined);
                process.stdout.write(`${Math.round(progress)}% complete`);
            },
        });
        const videoId = res.data.id;
        return { videoId };
    });
}
