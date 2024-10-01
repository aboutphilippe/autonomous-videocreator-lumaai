"use client";

import React, { createContext, useState, useEffect, ReactNode } from "react";
import { SeriesType } from "../series/Series";

type LocalStorageContextType = {
  series: SeriesType[];
  setSeries: (series: SeriesType[]) => void;
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

  useEffect(() => {
    if (typeof window !== "undefined") {
      localStorage.setItem("series", JSON.stringify(series));
    }
  }, [series]);

  return (
    <LocalStorageContext.Provider value={{ series, setSeries }}>
      {children}
    </LocalStorageContext.Provider>
  );
};
