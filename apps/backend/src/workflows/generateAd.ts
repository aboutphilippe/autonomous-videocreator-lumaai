import { log, step, sleep } from "@restackio/restack-sdk-ts/workflow";
import * as functions from "../functions";
import { azureSpeechTaskQueue } from "@restackio/integrations-azurespeech/taskQueue";
import * as azureSpeechFunctions from "@restackio/integrations-azurespeech/functions";
import { lumaaiTaskQueue } from "@restackio/integrations-lumaai/taskQueue";
import * as lumaaiFunctions from "@restackio/integrations-lumaai/functions";
import { falTaskQueue } from "@restackio/integrations-fal/taskQueue";
import * as falFunctions from "@restackio/integrations-fal/functions";

interface Input {
  prompt: string;
  fromImageUrl?: string;
}

export async function adWorkflow({ prompt, fromImageUrl }: Input) {
  const { message: lumaPrompt } = await step<typeof functions>(
    {}
  ).mistralGenerateText({
    prompt: `
    I want to prompt a text to video model to make a 15s video ad.
    Make it short and concise. Just give me the prompt for lumaai ${prompt}`,
  });

  const { message: audioAd } = await step<typeof functions>(
    {}
  ).mistralGenerateText({
    prompt: `
      Make the text for the voiceover of a video. 
      It needs to be 13s long so make it short and concise.
      This reponse is used by text to speech, make it as natural as possible.
      Make it sounds like David Attenborough describing the scene "${lumaPrompt}".
      Only output the text, no intro, no outro, no hashtags, no emojis, no nothing.
    `,
  });

  log.info("lumaPrompt", { lumaPrompt });

  const { media: audio } = await step<typeof azureSpeechFunctions>({
    taskQueue: azureSpeechTaskQueue,
  }).azureSpeech({
    text: audioAd,
    config: {
      voiceName: "en-US-DavisNeural",
      format: 22,
    },
  });

  log.info("audio", { audio });

  let lastVideoUrl: string | undefined;
  let previousGenerationId: string | undefined;

  for (let i = 0; i < 4; i++) {
    const { generation: queuedGeneration } = await step<typeof lumaaiFunctions>(
      {
        taskQueue: lumaaiTaskQueue,
      }
    ).lumaaiGenerate({
      prompt: `${prompt}.
        Make it look epic with a slow motion effect and with a low angle.`,
      aspectRatio: "9:16",
      extendGenerationId: previousGenerationId,
      fromImageUrl: previousGenerationId ? "" : fromImageUrl,
    });

    log.info(`queuedGeneration ${i + 1}`, { queuedGeneration });

    let video;
    if (queuedGeneration?.id) {
      while (!video || video.state !== "completed") {
        const { generation } = await step<typeof lumaaiFunctions>({
          taskQueue: lumaaiTaskQueue,
        }).lumaaiGetGeneration({
          generationId: queuedGeneration?.id,
        });
        video = generation;
        await sleep(60000);
      }

      log.info(`generation ${i + 1}`, { video });
      lastVideoUrl = video?.assets?.video!;
      previousGenerationId = queuedGeneration.id;
    }
  }

  if (lastVideoUrl) {
    const { outputPath } = await step<typeof functions>({}).mergeVideos({
      videoUrl: lastVideoUrl,
      generationId: previousGenerationId!,
      audioBase64: audio.payload,
    });
    return {
      outputPath,
      audio,
      videos: [lastVideoUrl], // Return the last video URL
    };
  }
}
