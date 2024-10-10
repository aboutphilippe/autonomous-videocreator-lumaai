import { Metadata } from "next";
import { Database } from "@/utils/supabase/types";
import { createClient } from "@/utils/supabase/server";
import SeriesList from "./Series";

export const metadata: Metadata = {
  title: "Series",
};
export type SerieType = Database["public"]["Tables"]["series"]["Row"] & {
  images: Database["public"]["Tables"]["images"]["Row"][];
};
export default async function Series() {
  const supabase = createClient();
  const { data: series } = await supabase
    .from("series")
    .select(
      `
        id, 
        title, 
        prompt,
        status,
        images(
            id, 
            title, 
            prompt, 
            url, 
            width, 
            height, 
            content_type, 
            created_at
        )
    `
    )
    .order("created_at", { ascending: false });

  return (
    <>
      <SeriesList series={series} />
    </>
  );
}
