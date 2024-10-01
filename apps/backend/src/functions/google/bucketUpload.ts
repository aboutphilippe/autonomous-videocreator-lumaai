import { Storage } from "@google-cloud/storage";
import { log } from "@restackio/restack-sdk-ts/function";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

interface Input {
  imageUrl: string;
}

interface Output {
  publicUrl: string;
}

export async function uploadImageToBucket({ imageUrl }: Input) {
  const storage = new Storage();
  const bucketName = process.env.GOOGLE_BUCKET_NAME!;
  const bucket = storage.bucket(bucketName);
  const fileName = `public/${uuidv4()}.png`;
  const file = bucket.file(fileName);

  // Download the image
  const response = await axios({
    url: imageUrl,
    responseType: "arraybuffer",
  });

  // Upload the image to the bucket
  await new Promise((resolve, reject) => {
    const writeStream = file.createWriteStream({
      metadata: {
        contentType: "image/png",
      },
    });

    writeStream.write(response.data);
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
