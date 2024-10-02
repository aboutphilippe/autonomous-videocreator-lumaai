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
  const audioPath = `${mediaFolder}/${input.generationId}.mp3`; // Save as MP3
  fs.writeFileSync(audioPath, audioBuffer);

  // Merge video and MP3 audio using ffmpeg
  const outputPath = `${mediaFolder}/${input.generationId}_merged.mp4`;
  await new Promise((resolve, reject) => {
    ffmpeg()
      .input(videoPath)
      .input(audioPath)
      .outputOptions("-c:v copy") // Copy the video codec
      .outputOptions("-c:a aac") // Ensure audio is in AAC format
      .outputOptions("-shortest")
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
