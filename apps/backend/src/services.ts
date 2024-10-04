import {
  youtubeUpload,
  youtubeAddVideoToPlaylist,
  youtubeCreatePlaylist,
  mergeMedia,
  uploadImageToBucket,
  uploadVideoToBucket,
  supabaseUpsertSerie,
  supabaseUpsertVideo,
  supabaseGetProfileTokens,
  supabaseUpdateProfileTokens,
  supabaseGetSerie,
  supabaseUpdateSerie,
} from "./functions";
import { lumaaiService } from "@restackio/integrations-lumaai";
import { azureSpeechService } from "@restackio/integrations-azurespeech";
import { openaiService } from "@restackio/integrations-openai";
import { falService } from "@restackio/integrations-fal";

import { client } from "./client";

async function services() {
  const workflowsPath = require.resolve("./workflows");
  try {
    await Promise.all([
      client.startService({
        workflowsPath,
        functions: {
          mergeMedia,
        },
        options: {
          rateLimit: 1000,
        },
      }),
      client.startService({
        taskQueue: "supabase",
        functions: {
          supabaseUpsertSerie,
          supabaseUpsertVideo,
          supabaseGetProfileTokens,
          supabaseUpdateProfileTokens,
          supabaseGetSerie,
          supabaseUpdateSerie,
        },
        options: {
          rateLimit: 100,
        },
      }),
      client.startService({
        taskQueue: "gcp",
        functions: { uploadImageToBucket, uploadVideoToBucket },
        options: {
          rateLimit: 100,
        },
      }),
      openaiService({ client }),
      falService({ client }),
      azureSpeechService({ client }),
      lumaaiService({ client }),
      client.startService({
        taskQueue: "youtube",
        functions: {
          youtubeAddVideoToPlaylist,
          youtubeCreatePlaylist,
        },
        options: {
          rateLimit: 10,
        },
      }),
      client.startService({
        taskQueue: "youtube-upload",
        functions: {
          youtubeUpload,
        },
        options: {
          rateLimit: 1 / (6 * 24 * 60 * 60), // Default quota 6 per day
        },
      }),
    ]);

    console.log("Services running successfully.");
  } catch (e) {
    console.error("Failed to run services", e);
  }
}

services().catch((err) => {
  console.error("Error running services:", err);
});
