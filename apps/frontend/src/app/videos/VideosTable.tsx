"use client";

import { columns } from "./columns";
import { DataTable } from "./components/data-table";
import { useContext } from "react";
import { Separator } from "@/app/components/ui/separator";
import { LocalStorageContext } from "../providers/LocalStorage";
import { demoVideos } from "../providers/demoData";

export default function VideosTable() {
  const { videos } = useContext(LocalStorageContext) || {
    videos: demoVideos,
  };

  const allVideos = [...demoVideos, ...videos];

  const dataTable =
    allVideos.map((video) => ({
      ...video,
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
          //@ts-ignore
          columns={columns}
        />
      </div>
    </>
  );
}
