import { FunctionFailure } from "@restackio/restack-sdk-ts/function";
import { supabaseClient } from "./client";

export async function supabaseUpdateProfileTokens({
  userId,
  googleAccessToken,
  googleRefreshToken,
}: {
  userId: string;
  googleAccessToken: string;
  googleRefreshToken: string;
}) {
  const { data, error } = await supabaseClient().from("profiles").upsert({
    id: userId,
    google_access_token: googleAccessToken,
    google_refresh_token: googleRefreshToken,
  });

  if (error) {
    throw FunctionFailure.nonRetryable("Error updating profile tokens");
  }

  return data;
}
