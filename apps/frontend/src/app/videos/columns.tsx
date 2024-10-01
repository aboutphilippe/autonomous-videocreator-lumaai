"use client";

import { ColumnDef } from "@tanstack/react-table";

import { Checkbox } from "@/app/components/ui/checkbox";

import { priorities, statuses } from "./components/filtersData";
import { Message } from "./schema";
import { DataTableColumnHeader } from "./components/data-table-column-header";
import { DataTableRowActions } from "./components/data-table-row-actions";
import Image from "next/image";
import { SparklesIcon } from "lucide-react";
import { format } from "date-fns";
import { LabelColor } from "@/app/components/ui/label";
export const columns: ColumnDef<Message>[] = [
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
    accessorKey: "key",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Id" />
    ),
    cell: ({ row }) => <div className="w-[80px]">{row.getValue("key")}</div>,
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
          {/* <p className="flex text-sm text-blue-500 items-center">
            <SparklesIcon className="h-4 w-4 mr-1" aria-hidden="true" />{" "}
            <span className="line-clamp-1 ">{row.original.summary}</span>
          </p> */}
        </div>
      );
    },
  },
  {
    accessorKey: "source",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Source" />
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
  // {
  //   accessorKey: "labels",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Labels" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div className="flex items-center gap-2 truncate max-w-40">
  //         {row.original.labels.map((label, index) => (
  //           <div key={index}>
  //             <LabelColor name={label.name ?? ""} color={label.color ?? ""} />
  //           </div>
  //         ))}
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   accessorKey: "priority",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Priority" />
  //   ),
  //   cell: ({ row }) => {
  //     const priority = priorities.find(
  //       (priority) => priority.value === row.getValue("priority")
  //     );

  //     if (!priority) {
  //       return null;
  //     }

  //     return (
  //       <div className="flex items-center">
  //         {priority.icon && (
  //           <priority.icon className="mr-2 h-4 w-4 text-muted-foreground" />
  //         )}
  //         <span>{priority.label}</span>
  //       </div>
  //     );
  //   },
  //   filterFn: (row, id, value) => {
  //     return value.includes(row.getValue(id));
  //   },
  // },
  // {
  //   accessorKey: "author.handle",
  //   header: ({ column }) => (
  //     <DataTableColumnHeader column={column} title="Author" />
  //   ),
  //   cell: ({ row }) => {
  //     return (
  //       <div style={{ display: "flex", alignItems: "center" }}>
  //         <Image
  //           src={row.original.author.imageUrl ?? ""}
  //           alt={row.original.author.handle}
  //           width={20}
  //           height={20}
  //           className="h-5 w-5 rounded-full mr-2"
  //         />
  //         {row.original.author.handle}
  //       </div>
  //     );
  //   },
  // },
  {
    accessorKey: "createdAt",
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title="Created" />
    ),
    cell: ({ row }) => (
      <div className="w-[90px]">
        {format(row.getValue("createdAt"), "d MMM yyyy")}
      </div>
    ),
  },
  {
    id: "actions",
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
];
