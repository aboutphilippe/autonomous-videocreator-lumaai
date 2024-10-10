import { FunctionFailure } from "@restackio/ai/function";
import { supabaseClient } from "./client";

export async function supabaseGetSerie({ serieId }: { serieId: string }) {
  const { data, error } = await supabaseClient()
    .from("series")
    .select("*, images(*)")
    .eq("id", serieId)
    .single();

  if (error) {
    throw FunctionFailure.nonRetryable("Error getting serie");
  }

  return {
    serie: data,
  };
}
