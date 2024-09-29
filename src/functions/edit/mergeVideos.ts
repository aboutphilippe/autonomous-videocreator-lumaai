import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import https from "https"; // Use the built-in https module

interface Input {
  generationId: string;
  videoUrl: string; // Add videoUrl to the Input interface
  audioBase64: string; // Add audioBase64 to the Input interface
}

interface Output {
  outputPath: string;
}

export async function mergeVideos(input: Input): Promise<Output> {
  // Fetch and save the video using https
  const videoPath = `${input.generationId}.mp4`;
  await new Promise((resolve, reject) => {
    const fileStream = fs.createWriteStream(videoPath);
    https.get(input.videoUrl, (response) => {
      response.pipe(fileStream);
      response.on("end", resolve);
      response.on("error", reject);
    });
  });

  // Decode and save the audio
  const audioBuffer = Buffer.from(input.audioBase64, "base64");
  const audioPath = `${input.generationId}.mp3`;
  fs.writeFileSync(audioPath, audioBuffer);

  // Merge video and audio using ffmpeg
  const outputPath = `${input.generationId}_merged.mp4`;
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .output(outputPath)
      .on("end", resolve)
      .on("error", reject)
      .run();
  });

  return { outputPath };
}
