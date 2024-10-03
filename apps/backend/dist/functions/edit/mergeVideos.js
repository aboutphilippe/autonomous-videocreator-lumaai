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
exports.mergeMedia = mergeMedia;
const function_1 = require("@restackio/restack-sdk-ts/function");
const fluent_ffmpeg_1 = __importDefault(require("fluent-ffmpeg"));
const fs_1 = __importDefault(require("fs"));
const https_1 = __importDefault(require("https")); // Use the built-in https module
function mergeMedia(input) {
    return __awaiter(this, void 0, void 0, function* () {
        const mediaFolder = "media";
        if (!fs_1.default.existsSync(mediaFolder)) {
            fs_1.default.mkdirSync(mediaFolder);
        }
        let videoPath;
        if (input.videoUrl) {
            // Fetch and save the video using https
            videoPath = `${mediaFolder}/${input.generationId}.mp4`;
            yield new Promise((resolve, reject) => {
                const fileStream = fs_1.default.createWriteStream(videoPath);
                if (input.videoUrl) {
                    https_1.default.get(input.videoUrl, (response) => {
                        response.pipe(fileStream);
                        response.on("end", resolve);
                    });
                }
                else {
                    reject(new Error("videoUrl is undefined"));
                }
            });
        }
        else if (input.imageUrl) {
            // Fetch and save the image using https
            const imagePath = `${mediaFolder}/${input.generationId}.jpg`;
            yield new Promise((resolve, reject) => {
                const fileStream = fs_1.default.createWriteStream(imagePath);
                if (input.imageUrl) {
                    https_1.default.get(input.imageUrl, (response) => {
                        response.pipe(fileStream);
                        response.on("end", resolve);
                    });
                }
                else {
                    reject(new Error("Image URL is undefined"));
                }
            });
            videoPath = imagePath;
        }
        else {
            throw new Error("Either videoUrl or imageUrl must be provided.");
        }
        // Decode and save the audio
        const audioBuffer = Buffer.from(input.audioBase64, "base64");
        const audioPath = `${mediaFolder}/${input.generationId}.mp3`;
        fs_1.default.writeFileSync(audioPath, audioBuffer);
        // Merge media and MP3 audio using ffmpeg
        const outputPath = `${mediaFolder}/${input.generationId}_output.mp4`;
        yield new Promise((resolve, reject) => {
            const ffmpegCommand = (0, fluent_ffmpeg_1.default)().input(videoPath);
            if (input.imageUrl) {
                ffmpegCommand.loop(); // Loop the image if it's an image
            }
            ffmpegCommand
                .input(audioPath)
                .outputOptions("-c:v libx264") // Use H.264 video codec
                .outputOptions("-c:a aac") // Ensure audio is in AAC format
                .outputOptions("-shortest")
                .output(outputPath)
                .on("start", (commandLine) => {
                function_1.log.info("Spawned Ffmpeg with command: " + commandLine);
            })
                .on("progress", (progress) => {
                function_1.log.info("Processing: " + progress.percent + "% done");
            })
                .on("end", resolve)
                .on("error", (err, stdout, stderr) => {
                function_1.log.error("Error: " + err.message);
                function_1.log.error("ffmpeg stdout: " + stdout);
                function_1.log.error("ffmpeg stderr: " + stderr);
                reject(err);
            })
                .run();
        });
        return { outputPath };
    });
}
