import { google } from "googleapis";
import { getAuthClient } from "./auth";

export async function youtubeAddVideoToPlaylist({
  videoId,
  playlistId,
  accessToken,
  refreshToken,
}: {
  videoId: string;
  playlistId: string;
  accessToken: string;
  refreshToken: string;
}): Promise<void> {
  const auth = getAuthClient(accessToken, refreshToken);

  const youtube = google.youtube({
    version: "v3",
    auth,
  });

  await youtube.playlistItems.insert({
    part: ["snippet"],
    requestBody: {
      snippet: {
        playlistId,
        resourceId: {
          kind: "youtube#video",
          videoId,
        },
      },
    },
  });

  console.log(`Video ${videoId} added to playlist ${playlistId}`);
}

export async function youtubeCreatePlaylist({
  title,
  description,
  accessToken,
  refreshToken,
}: {
  title: string;
  description: string;
  accessToken: string;
  refreshToken: string;
}): Promise<string> {
  const auth = getAuthClient(accessToken, refreshToken);

  const youtube = google.youtube({
    version: "v3",
    auth,
  });

  const res = await youtube.playlists.insert({
    part: ["snippet", "status"],
    requestBody: {
      snippet: {
        title,
        description,
      },
      status: {
        privacyStatus: "public",
      },
    },
  });

  const playlistId = res.data.id!;
  console.log(`Playlist ${title} created with ID ${playlistId}`);
  return playlistId;
}
