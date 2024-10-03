import { Metadata } from "next";
import VideosTable from "./VideosTable";
import { createClient } from "@/utils/supabase/server";
import { Database } from "@/utils/supabase/types";

export const metadata: Metadata = {
  title: "Videos",
  description: "Videos produced.",
};
export type VideoType = Database["public"]["Tables"]["videos"]["Row"];

export default async function Videos() {
  const supabase = createClient();
  const { data: videos } = await supabase.from("videos").select();
  const { data: series } = await supabase.from("series").select(`id, title`);

  const filterSeries = series?.map((serie) => ({
    label: serie.title,
    value: serie.id,
  }));

  return <VideosTable videos={videos!} filterSeries={filterSeries} />;
}
