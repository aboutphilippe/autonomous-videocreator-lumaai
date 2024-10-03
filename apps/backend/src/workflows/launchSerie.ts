import { startChild, step } from "@restackio/restack-sdk-ts/workflow";
import * as functions from "../functions";
import { createVideo } from "./createVideo";

interface Input {
  userId: string;
  serieId: string;
  createPlaylist?: boolean;
}

export async function launchSerie({ userId, serieId, createPlaylist }: Input) {
  const { serie } = await step<typeof functions>({
    taskQueue: "supabase",
  }).supabaseGetSerie({
    serieId,
  });

  if (createPlaylist) {
    const { accessToken, refreshToken } = await step<typeof functions>({
      taskQueue: "supabase",
    }).supabaseGetProfileTokens({
      userId,
    });

    const playlistId = await step<typeof functions>({
      taskQueue: "youtube",
    }).youtubeCreatePlaylist({
      title: serie.title,
      description: serie.description,
      accessToken,
      refreshToken,
    });

    await step<typeof functions>({
      taskQueue: "supabase",
    }).supabaseUpdateSerie({
      serieId,
      status: "LIVE",
      playlistId,
    });
  } else {
    await step<typeof functions>({
      taskQueue: "supabase",
    }).supabaseUpdateSerie({
      serieId,
      status: "LIVE",
    });
  }

  const videos = await Promise.all(
    serie.images.map(async (image: any) => {
      const childWorkflow = await startChild(createVideo, {
        args: [
          {
            userId,
            serieId,
            title: image.title,
            prompt: image.prompt,
            fromImageUrl: image.url,
            playlistId: serie.playlistId,
            uploadToYoutube: false,
          },
        ],
        workflowId: `${image.id}-createVideo`,
      });

      return {
        ...videos,
        videos: childWorkflow.firstExecutionRunId,
      };
    })
  );

  return {
    videos,
  };
}
