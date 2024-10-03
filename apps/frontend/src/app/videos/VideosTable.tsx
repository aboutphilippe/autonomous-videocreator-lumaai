"use client";

import { columns } from "./columns";
import { DataTable } from "./components/data-table";
import { Separator } from "@/app/components/ui/separator";

import { VideoType } from "./page";

export default function VideosTable({
  videos,
  filterSeries,
}: {
  videos?: VideoType[];
  filterSeries?: { label: string; value: string }[];
}) {
  const dataTable =
    videos?.map((video) => ({
      ...video,
      series_id: video.series_id
        ? filterSeries?.find((series) => series.value === video.series_id)
            ?.label
        : null,
    })) ?? [];

  return (
    <>
      <div className="flex items-center px-4 h-[52px] justify-between ">
        <h1 className="text-lg font-medium">Videos</h1>
      </div>
      <Separator />
      <div className="p-4">
        <DataTable
          data={dataTable}
          filterSeries={filterSeries}
          //@ts-ignore
          columns={columns}
        />
      </div>
    </>
  );
}
