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
exports.uploadVideoToBucket = uploadVideoToBucket;
exports.uploadImageToBucket = uploadImageToBucket;
const storage_1 = require("@google-cloud/storage");
const function_1 = require("@restackio/restack-sdk-ts/function");
const axios_1 = __importDefault(require("axios"));
const uuid_1 = require("uuid");
const sharp_1 = __importDefault(require("sharp"));
const fs = require("fs");
function uploadVideoToBucket(_a) {
    return __awaiter(this, arguments, void 0, function* ({ outputPath }) {
        const storage = new storage_1.Storage();
        const bucketName = process.env.GOOGLE_BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const fileName = `public/${(0, uuid_1.v4)()}.mp4`;
        const file = bucket.file(fileName);
        // Read the video file from the outputPath
        const videoBuffer = fs.readFileSync(outputPath);
        // Upload the video to the bucket
        yield new Promise((resolve, reject) => {
            const writeStream = file.createWriteStream({
                metadata: {
                    contentType: "video/mp4",
                },
            });
            writeStream.write(videoBuffer);
            writeStream.end();
            writeStream.on("finish", resolve).on("error", reject);
        });
        // Make the file publicly readable
        yield file.makePublic();
        // Return the public URL
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        function_1.log.info("publicUrl", { publicUrl });
        return { publicUrl };
    });
}
function uploadImageToBucket(_a) {
    return __awaiter(this, arguments, void 0, function* ({ imageUrl, }) {
        const storage = new storage_1.Storage();
        const bucketName = process.env.GOOGLE_BUCKET_NAME;
        const bucket = storage.bucket(bucketName);
        const fileName = `public/${(0, uuid_1.v4)()}.jpg`;
        const file = bucket.file(fileName);
        // Download the image
        const response = yield (0, axios_1.default)({
            url: imageUrl,
            responseType: "arraybuffer",
        });
        // Convert the image to JPG
        const jpgBuffer = yield (0, sharp_1.default)(response.data).jpeg().toBuffer();
        // Upload the image to the bucket
        yield new Promise((resolve, reject) => {
            const writeStream = file.createWriteStream({
                metadata: {
                    contentType: "image/jpeg",
                },
            });
            writeStream.write(jpgBuffer);
            writeStream.end();
            writeStream.on("finish", resolve).on("error", reject);
        });
        // Make the file publicly readable
        yield file.makePublic();
        // Return the public URL
        const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
        function_1.log.info("publicUrl", { publicUrl });
        return { publicUrl };
    });
}
