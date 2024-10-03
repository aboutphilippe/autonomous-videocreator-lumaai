import { FunctionFailure } from "@restackio/restack-sdk-ts/function";
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
    .select();

  if (error) {
    throw FunctionFailure.nonRetryable("Error updating serie status");
  }

  return data;
}
