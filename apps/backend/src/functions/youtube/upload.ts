import fs from "fs";
import readline from "readline";
import { google } from "googleapis";
import { getAuthClient } from "./auth";

interface Input {
  title: string;
  description: string;
  filePath: string;
  accessToken: string;
  refreshToken: string;
}

interface Output {
  videoId: string;
}

export async function youtubeUpload({
  title,
  description,
  filePath,
  accessToken,
  refreshToken,
}: Input): Promise<Output> {
  const fileSize = fs.statSync(filePath).size;

  const auth = getAuthClient(accessToken, refreshToken);

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
          embeddable: true,
          privacyStatus: "private",
          madeForKids: true,
          selfDeclaredMadeForKids: true,
          publicStatsViewable: true,
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

  const videoId = res.data.id!;

  return { videoId };
}
