import { mistralGenerateText } from "./functions";
import { lumaaiService } from "@restackio/integrations-lumaai";
import { azureSpeechService } from "@restackio/integrations-azurespeech";
import { client } from "./client";

async function services() {
  const workflowsPath = require.resolve("./workflows");
  try {
    await Promise.all([
      // Start service with current workflows and functions
      client.startService({
        workflowsPath,
        functions: { mistralGenerateText },
      }),
      // Start the azure service
      azureSpeechService({ client }),
      // Start the luma service
      lumaaiService({ client }),
    ]);

    console.log("Services running successfully.");
  } catch (e) {
    console.error("Failed to run services", e);
  }
}

services().catch((err) => {
  console.error("Error running services:", err);
});
