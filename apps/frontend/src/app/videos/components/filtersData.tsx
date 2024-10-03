"use client";

import {
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

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
