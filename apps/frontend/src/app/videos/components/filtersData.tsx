"use client";

import { demoSeries } from "@/app/providers/demoData";
import { LocalStorageContext } from "@/app/providers/LocalStorage";
import { SeriesType } from "@/app/series/Series";
import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";
import { useContext } from "react";

export const statuses = [
  {
    value: "NEW",
    label: "New",
    icon: CircleIcon,
  },
  {
    value: "DRAFT",
    label: "Draft",
    icon: StopwatchIcon,
  },
  {
    value: "PUBLISHED",
    label: "Published",
    icon: CheckCircledIcon,
  },
  {
    value: "PRIVATE",
    label: "Private",
    icon: CrossCircledIcon,
  },
  {
    value: "ERROR",
    label: "Error",
    icon: ExclamationTriangleIcon,
  },
];

export function series() {
  const { series } = useContext(LocalStorageContext) || {
    series: demoSeries,
  };

  const filterSeries = series?.map((serie: SeriesType) => ({
    label: serie.output.title,
    value: serie.runId,
  }));
  return filterSeries;
}
