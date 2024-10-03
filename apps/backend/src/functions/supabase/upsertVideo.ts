import { supabaseClient } from "./client";
import { Database } from "./types";

export type VideosInsert = Database["public"]["Tables"]["videos"]["Insert"];

export async function supabaseUpsertVideo({ video }: { video: VideosInsert }) {
  const { data } = await supabaseClient().from("videos").upsert(video).select();
  return data;
}
