import { FunctionFailure, log } from "@restackio/restack-sdk-ts/function";
import { supabaseClient } from "./client";

export async function supabaseUpdateSerie({
  serieId,
  status,
  playlistId,
}: {
  serieId: string;
  status: string;
  playlistId?: string;
}) {
  const { data, error } = await supabaseClient()
    .from("series")
    .update({
      id: serieId,
      status,
      playlist_id: playlistId,
    })
    .eq("id", serieId)
    .select();

  if (error) {
    log.error("Error updating serie status", error);
    throw FunctionFailure.nonRetryable("Error updating serie status");
  }

  return data;
}
