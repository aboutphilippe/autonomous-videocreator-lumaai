"use client";

import { ColumnDef } from "@tanstack/react-table";
import { Checkbox } from "@/app/components/ui/checkbox";
import { statuses } from "./components/filtersData";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import { DataTableRowActions } from "./components/data-table-row-actions";
import Image from "next/image";
import { format } from "date-fns";
import { VideoType } from "@/app/providers/LocalStorage";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
} from "@/app/components/ui/dialog"; // Assuming you have a Modal component

export const columns: ColumnDef<VideoType>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value: boolean) =>
          table.toggleAllPageRowsSelected(!!value)
        }
        aria-label="Select all"
        className="translate-y-[2px]"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value: boolean) => row.toggleSelected(!!value)}
        aria-label="Select row"
        className="translate-y-[2px]"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "runId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => {
      const [isDialogOpen, setIsDialogOpen] = useState(false);

      return (
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Image
              src={row.original.thumbnailUrl}
              alt="Thumbnail"
              width={160}
              height={90}
              className="rounded-md cursor-pointer"
            />
          </DialogTrigger>
          <DialogContent className="max-w-md">
            <div>
              <video
                width="640"
                height="360"
                controls
                autoPlay
                src={row.original.videoUrl}
              />
            </div>
          </DialogContent>
        </Dialog>
      );
    },
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "title",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Title" />
    ),
    cell: ({ row }) => {
      return (
        <div className="space-y-1">
          <p className="line-clamp-1">{row.original.title}</p>
          <p className="flex text-sm text-neutral-500 items-center">
            <span className="line-clamp-2">{row.original.description}</span>
          </p>
        </div>
      );
    },
  },
  {
    accessorKey: "seriesId",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Series" />
    ),
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "status",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Status" />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue("status")
      );

      if (!status) {
        return null;
      }
      return (
        <div className="flex w-[100px] items-center">
          {status.icon && (
            <status.icon className="mr-2 h-4 w-4 text-muted-foreground" />
          )}
          <span>{status.label}</span>
        </div>
      );
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id));
    },
  },
  {
    accessorKey: "youtubeVideo.views",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Views" />
    ),
    cell: ({ row }) => (
      <div className="w-[90px]">{row.original.youtubeVideo?.views}</div>
    ),
  },
  {
    accessorKey: "youtubeVideo.likes",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Likes" />
    ),
    cell: ({ row }) => (
      <div className="w-[90px]">{row.original.youtubeVideo?.views}</div>
    ),
  },
  {
    accessorKey: "youtubeVideo.comments",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Comments" />
    ),
    cell: ({ row }) => (
      <div className="w-[90px]">{row.original.youtubeVideo?.views}</div>
    ),
  },
  {
    accessorKey: "youtubeVideo.uploadedAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Uploaded At" />
    ),
    cell: ({ row }) => (
      <div className="w-[90px]">
        {format(row.original.youtubeVideo?.uploadedAt, "d MMM yyyy")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
