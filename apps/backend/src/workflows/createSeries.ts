import { step } from "@restackio/restack-sdk-ts/workflow";
import { openaiTaskQueue } from "@restackio/integrations-openai/taskQueue";
import * as openaiFunctions from "@restackio/integrations-openai/functions";
import { falTaskQueue } from "@restackio/integrations-fal/taskQueue";
import * as falFunctions from "@restackio/integrations-fal/functions";
import { z } from "zod";
import zodToJsonSchema from "zod-to-json-schema";

interface Input {
  title: string;
  prompt: string;
  amount: number;
}

export async function createSeries({ title, prompt, amount }: Input) {
  const previewsSchema = z.object({
    seriesDescription: z.string().describe("The description of the series."),
    previews: z.array(
      z.object({
        title: z.string().describe("The title of the video."),
        imagePrompt: z.string().describe("The prompt of the image."),
      })
    ),
  });

  type Previews = z.infer<typeof previewsSchema>;

  const seriesJsonSchema = {
    name: "series",
    schema: zodToJsonSchema(previewsSchema),
  };

  const seriesOutput = await step<typeof openaiFunctions>({
    taskQueue: openaiTaskQueue,
  }).openaiChatCompletionsBase({
    userContent: prompt,
    model: "gpt-4o-mini",
    systemContent: `Based on the user prompt, create a variety of scenarios for a series of videos.
      For each video preview, make the image prompt used for generating the first frame of the video.
      Return max ${amount} previews.
      Be very descriptive of the character in the scene so there is no confusion and not generate images of anybody else than the character in the scene.
      `,
    jsonSchema: seriesJsonSchema,
  });

  const seriesResponse = seriesOutput.result.choices[0].message.content;

  if (!seriesResponse) {
    throw new Error("No series response");
  }

  const previews = JSON.parse(seriesResponse) as Previews;

  let imagePreviews = [];

  for (const preview of previews.previews) {
    const { images } = await step<typeof falFunctions>({
      taskQueue: falTaskQueue,
    }).falRun({
      id: "fal-ai/flux/schnell",
      prompt: preview.imagePrompt,
      imageSize: "portrait_16_9",
      numInferenceSteps: 4,
      enableSafetyChecker: true,
    });

    const imagePreview = {
      ...preview,
      images: images, // Add images to the new object
    };

    imagePreviews.push(imagePreview);
  }

  return {
    title,
    prompt,
    imagePreviews,
  };
}
