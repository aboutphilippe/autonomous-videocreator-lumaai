import { log, step } from "@restackio/restack-sdk-ts/workflow";
import * as functions from "../functions";
import { azureSpeechTaskQueue } from "@restackio/integrations-azurespeech/taskQueue";
import * as azureSpeechFunctions from "@restackio/integrations-azurespeech/functions";
import { lumaaiTaskQueue } from "@restackio/integrations-lumaai/taskQueue";
import * as lumaaiFunctions from "@restackio/integrations-lumaai/functions";

interface Input {
  prompt: string;
}

export async function adWorkflow({ prompt }: Input) {
  const { message: lumaPrompt } = await step<typeof functions>(
    {}
  ).mistralGenerateText({
    prompt: `I want to prompt a text to video model to make a 15s video ad. Make it short and concise. ${prompt}`,
  });

  const { message: audioAd } = await step<typeof functions>(
    {}
  ).mistralGenerateText({
    prompt: `Make the text for the voiceover of a video ad for ${lumaPrompt}. It needs to be 15s long so make it short and concise.`,
  });

  log.info("lumaPrompt", { lumaPrompt });

  const { media: audio } = await step<typeof azureSpeechFunctions>({
    taskQueue: azureSpeechTaskQueue,
  }).azureSpeech({
    text: audioAd,
    config: {
      voiceName: "en-US-DavisNeural",
    },
    twilioEncoding: true,
  });

  log.info("audio", { audio });

  const { generation: video } = await step<typeof lumaaiFunctions>({
    taskQueue: lumaaiTaskQueue,
  }).lumaaiGeneration({
    prompt: lumaPrompt,
    aspectRatio: "9:21",
  });

  log.info("video", { video });

  return {
    audio,
    video,
  };
}
