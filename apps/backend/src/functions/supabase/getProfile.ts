import { FunctionFailure } from "@restackio/restack-sdk-ts/function";
import { supabaseClient } from "./client";

export async function supabaseGetProfileTokens({ userId }: { userId: string }) {
  const { data, error } = await supabaseClient()
    .from("profiles")
    .select("google_access_token, google_refresh_token")
    .eq("id", userId)
    .single();

  if (error) {
    throw FunctionFailure.nonRetryable("Error getting profile tokens");
  }

  return {
    accessToken: data?.google_access_token,
    refreshToken: data?.google_refresh_token,
  };
}
