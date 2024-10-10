import { log } from "@restackio/ai/function";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import https from "https"; // Use the built-in https module

interface Input {
  generationId: string;
  videoUrl?: string; // Optional videoUrl
  imageUrl?: string; // Optional imageUrl
  audioBase64: string;
}

interface Output {
  outputPath: string;
}

export async function mergeMedia(input: Input): Promise<Output> {
  const mediaFolder = "media";
  if (!fs.existsSync(mediaFolder)) {
    fs.mkdirSync(mediaFolder);
  }

  let videoPath: string;

  if (input.videoUrl) {
    // Fetch and save the video using https
    videoPath = `${mediaFolder}/${input.generationId}.mp4`;
    await new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(videoPath);
      if (input.videoUrl) {
        https.get(input.videoUrl, (response) => {
          response.pipe(fileStream);
          response.on("end", resolve);
        });
      } else {
        reject(new Error("videoUrl is undefined"));
      }
    });
  } else if (input.imageUrl) {
    // Fetch and save the image using https
    const imagePath = `${mediaFolder}/${input.generationId}.jpg`;
    await new Promise((resolve, reject) => {
      const fileStream = fs.createWriteStream(imagePath);
      if (input.imageUrl) {
        https.get(input.imageUrl, (response) => {
          response.pipe(fileStream);
          response.on("end", resolve);
        });
      } else {
        reject(new Error("Image URL is undefined"));
      }
    });
    videoPath = imagePath;
  } else {
    throw new Error("Either videoUrl or imageUrl must be provided.");
  }

  // Decode and save the audio
  const audioBuffer = Buffer.from(input.audioBase64, "base64");
  const audioPath = `${mediaFolder}/${input.generationId}.mp3`;
  fs.writeFileSync(audioPath, audioBuffer);

  // Merge media and MP3 audio using ffmpeg
  const outputPath = `${mediaFolder}/${input.generationId}_output.mp4`;
  await new Promise((resolve, reject) => {
    const ffmpegCommand = ffmpeg().input(videoPath);

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
        log.info("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("progress", (progress) => {
        log.info("Processing: " + progress.percent + "% done");
      })
      .on("end", resolve)
      .on("error", (err, stdout, stderr) => {
        log.error("Error: " + err.message);
        log.error("ffmpeg stdout: " + stdout);
        log.error("ffmpeg stderr: " + stderr);
        reject(err);
      })
      .run();
  });

  return { outputPath };
}
