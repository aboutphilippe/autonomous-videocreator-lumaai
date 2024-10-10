import { step } from "@restackio/ai/workflow";
import * as functions from "../functions";

interface Input {
  userId: string;
  googleAccessToken: string;
  googleRefreshToken: string;
}

export async function updateGoogleToken({
  userId,
  googleAccessToken,
  googleRefreshToken,
}: Input) {
  await step<typeof functions>({
    taskQueue: "supabase",
  }).supabaseUpdateProfileTokens({
    userId,
    googleAccessToken,
    googleRefreshToken,
  });

  return true;
}
