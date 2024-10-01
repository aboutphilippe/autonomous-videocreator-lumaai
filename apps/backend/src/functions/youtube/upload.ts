import fs from "fs";
import readline from "readline";
import { google } from "googleapis";

interface Input {
  title: string;
  description: string;
  filePath: string;
  sessionAccessToken: string;
}

interface Output {
  videoId: string;
}

export async function youtubeUpload({
  title,
  description,
  filePath,
  sessionAccessToken,
}: Input): Promise<Output> {
  const fileSize = fs.statSync(filePath).size;

  const auth = new google.auth.OAuth2({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  });

  auth.setCredentials({
    access_token: sessionAccessToken,
  });
  const youtube = google.youtube({
    version: "v3",
    auth,
  });

  const res = await youtube.videos.insert(
    {
      part: ["id", "snippet", "status"],
      notifySubscribers: false,
      requestBody: {
        snippet: {
          title,
          description,
        },
        status: {
          privacyStatus: "private",
        },
      },
      media: {
        body: fs.createReadStream(filePath),
      },
    },
    {
      onUploadProgress: (evt) => {
        const progress = (evt.bytesRead / fileSize) * 100;
        readline.clearLine(process.stdout, 0);
        readline.cursorTo(process.stdout, 0, undefined);
        process.stdout.write(`${Math.round(progress)}% complete`);
      },
    }
  );

  console.log("\n\n");
  console.log(res.data);

  return { videoId: res.data.id! };
}
