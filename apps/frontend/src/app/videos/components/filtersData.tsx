"use client";

// import { api } from '@/lib/api';
// import { Source, SourceType } from '@openconductor/db';
import {
  ArrowDownIcon,
  ArrowRightIcon,
  ArrowUpIcon,
  CheckCircledIcon,
  CircleIcon,
  CrossCircledIcon,
  ExclamationTriangleIcon,
  GitHubLogoIcon,
  ShadowNoneIcon,
  StopwatchIcon,
} from "@radix-ui/react-icons";

export const labels = [
  {
    value: "triage needed",
    label: "Triage needed",
  },
  {
    value: "good first issue",
    label: "Good first issue",
  },
];

export const statuses = [
  {
    value: "OPEN",
    label: "Open",
    icon: CircleIcon,
  },
  {
    value: "DRAFT",
    label: "Draft",
    icon: StopwatchIcon,
  },
  {
    value: "MERGED",
    label: "Merged",
    icon: CheckCircledIcon,
  },

  {
    value: "CLOSED",
    label: "Closed",
    icon: CrossCircledIcon,
  },
];

export const priorities = [
  {
    label: "No priority",
    value: undefined,
    icon: ShadowNoneIcon,
  },
  {
    label: "Urgent",
    value: "urgent",
    icon: ExclamationTriangleIcon,
  },
  {
    label: "High",
    value: "high",
    icon: ArrowUpIcon,
  },
  {
    label: "Medium",
    value: "medium",
    icon: ArrowRightIcon,
  },
  {
    label: "Low",
    value: "low",
    icon: ArrowDownIcon,
  },
];

const dummySources = [
  {
    id: "source1",
    type: "GITHUB_REPO",
    sourceId: "owner/repo1",
    name: "Repo 1",
    url: "http://example.com/repo1",
    imageUrl: "http://example.com/image1.jpg",
    description: "Description for Repo 1",
    enabled: true,
    teamId: "team1",
    creatorId: "creator1",
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: "author1",
  },
  {
    id: "source2",
    type: "OTHER",
    sourceId: "owner/repo2",
    name: "Repo 2",
    url: "http://example.com/repo2",
    imageUrl: "http://example.com/image2.jpg",
    description: "Description for Repo 2",
    enabled: true,
    teamId: "team2",
    creatorId: "creator2",
    createdAt: new Date(),
    updatedAt: new Date(),
    authorId: "author2",
  },
];

export function sources() {
  const filterSources = dummySources.map((source) => ({
    label: source.name,
    value: source.sourceId,
    icon: source.type === "GITHUB_REPO" ? GitHubLogoIcon : undefined,
  }));
  return filterSources;
}
