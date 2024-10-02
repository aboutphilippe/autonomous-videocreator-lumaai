"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { SeriesType } from "../series/Series";

export type VideoType = {
  workflowId: string;
  runId: string;
  seriesId: string;
  playlistId: string;
  title: string;
  description: string;
  thumbnailUrl: string;
  videoUrl: string;
  status: "NEW" | "DRAFT" | "PUBLISHED" | "PRIVATE" | "ERROR";
  youtubeVideo: {
    videoId: string;
    title: string;
    description: string;
    thumbnailUrl: string;
    visibility: "private" | "public";
    uploadedAt: Date;
    views: number;
    comments: number;
    likes: number;
  };
};

type LocalStorageContextType = {
  series: SeriesType[];
  setSeries: (series: SeriesType[]) => void;
  videos: VideoType[];
  setVideos: (videos: VideoType[]) => void;
};

export const LocalStorageContext = createContext<
  LocalStorageContextType | undefined
>(undefined);

export const LocalStorageProvider = ({ children }: { children: ReactNode }) => {
  const [series, setSeries] = useState<SeriesType[]>(() => {
    if (typeof window !== "undefined") {
      const savedSeries = localStorage.getItem("series");
      return savedSeries ? JSON.parse(savedSeries) : [];
    }
    return [];
  });

  const [videos, setVideos] = useState<VideoType[]>(() => {
    if (typeof window !== "undefined") {
      const savedVideos = localStorage.getItem("videos");
      return savedVideos ? JSON.parse(savedVideos) : [];
    }
    return [];
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("series", JSON.stringify(series));
    }
  }, [series]);

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("videos", JSON.stringify(videos));
    }
  }, [videos]);

  return (
    <LocalStorageContext.Provider
      value={{ series, setSeries, videos, setVideos }}
    >
      {children}
    </LocalStorageContext.Provider>
  );
};
