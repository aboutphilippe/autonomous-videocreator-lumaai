import { mistral } from "@ai-sdk/mistral";
import { generateText } from "ai";

interface Input {
  prompt: string;
}

interface Output {
  message: string;
}

export async function mistralGenerateText(input: Input): Promise<Output> {
  const { text } = await generateText({
    model: mistral("mistral-large-latest"),
    prompt: `${input.prompt}`,
  });

  return { message: text };
}
