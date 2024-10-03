import { FunctionFailure } from "@restackio/restack-sdk-ts/function";
import { supabaseClient } from "./client";
import { Database } from "./types";

export type SeriesInsert = Database["public"]["Tables"]["series"]["Insert"];
export type ImagesInsert = Omit<
  Database["public"]["Tables"]["images"]["Insert"],
  "series_id"
>;

export async function supabaseUpsertSerie({
  serie,
  images,
}: {
  serie: SeriesInsert;
  images: ImagesInsert[];
}) {
  const supabase = supabaseClient();

  // Upsert the series
  const { data: upsertedSerie, error: serieError } = await supabase
    .from("series")
    .upsert(serie)
    .select();

  if (serieError) {
    throw FunctionFailure.nonRetryable("Error upserting series");
  }

  const seriesId = upsertedSerie[0].id;

  // Prepare images data with the series_id
  const imagesWithSeriesId = images.map((image) => ({
    ...image,
    series_id: seriesId,
  }));

  // Upsert the images
  const { error: imagesError } = await supabase
    .from("images")
    .upsert(imagesWithSeriesId);

  if (imagesError) {
    throw FunctionFailure.nonRetryable("Error upserting image series");
  }

  return {
    serie: upsertedSerie,
  };
}
