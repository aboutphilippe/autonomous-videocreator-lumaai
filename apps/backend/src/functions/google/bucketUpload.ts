import { Storage } from "@google-cloud/storage";
import { log } from "@restackio/ai/function";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";
import sharp from "sharp";
const fs = require("fs");

interface ImageInput {
  imageUrl: string;
}

interface VideoInput {
  outputPath: string;
}

interface Output {
  publicUrl: string;
}

export async function uploadVideoToBucket({ outputPath }: VideoInput) {
  const storage = new Storage();
  const bucketName = process.env.GOOGLE_BUCKET_NAME!;
  const bucket = storage.bucket(bucketName);
  const fileName = `public/${uuidv4()}.mp4`;
  const file = bucket.file(fileName);

  // Read the video file from the outputPath
  const videoBuffer = fs.readFileSync(outputPath);

  // Upload the video to the bucket
  await new Promise((resolve, reject) => {
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
  await file.makePublic();

  // Return the public URL
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
  log.info("publicUrl", { publicUrl });
  return { publicUrl };
}

export async function uploadImageToBucket({
  imageUrl,
}: ImageInput): Promise<Output> {
  const storage = new Storage();
  const bucketName = process.env.GOOGLE_BUCKET_NAME!;
  const bucket = storage.bucket(bucketName);
  const fileName = `public/${uuidv4()}.jpg`;
  const file = bucket.file(fileName);

  // Download the image
  const response = await axios({
    url: imageUrl,
    responseType: "arraybuffer",
  });

  // Convert the image to JPG
  const jpgBuffer = await sharp(response.data).jpeg().toBuffer();

  // Upload the image to the bucket
  await new Promise((resolve, reject) => {
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
  await file.makePublic();

  // Return the public URL
  const publicUrl = `https://storage.googleapis.com/${bucketName}/${fileName}`;
  log.info("publicUrl", { publicUrl });
  return { publicUrl };
}
