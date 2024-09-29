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
  const mediaFolder = "media";
  if (!fs.existsSync(mediaFolder)) {
    fs.mkdirSync(mediaFolder);
  }

  // Fetch and save the video using https
  const videoPath = `${mediaFolder}/${input.generationId}.mp4`;
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
  const audioPath = `${mediaFolder}/${input.generationId}.mulaw`;
  fs.writeFileSync(audioPath, audioBuffer);

  // Convert mulaw audio to AAC
  const aacAudioPath = `${mediaFolder}/${input.generationId}.aac`;
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(audioPath)
      .inputFormat("mulaw") // Specify the input format for the audio
      .audioCodec("aac") // Convert to AAC
      .output(aacAudioPath)
      .on("start", (commandLine) => {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("progress", (progress) => {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", resolve)
      .on("error", (err, stdout, stderr) => {
        console.error("Error: " + err.message);
        console.error("ffmpeg stdout: " + stdout);
        console.error("ffmpeg stderr: " + stderr);
        reject(err);
      })
      .run();
  });

  // Merge video and converted audio using ffmpeg
  const outputPath = `${mediaFolder}/${input.generationId}_merged.mp4`;
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(aacAudioPath)
      .output(outputPath)
      .on("start", (commandLine) => {
        console.log("Spawned Ffmpeg with command: " + commandLine);
      })
      .on("progress", (progress) => {
        console.log("Processing: " + progress.percent + "% done");
      })
      .on("end", resolve)
      .on("error", (err, stdout, stderr) => {
        console.error("Error: " + err.message);
        console.error("ffmpeg stdout: " + stdout);
        console.error("ffmpeg stderr: " + stderr);
        reject(err);
      })
      .run();
  });

  return { outputPath };
}
