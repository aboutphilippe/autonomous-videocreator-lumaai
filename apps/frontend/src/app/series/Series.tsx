"use client";

import React, { useState } from "react";
import { Separator } from "@/app/components/ui/separator";
import { SeriesCard } from "./SeriesCard";
import { SeriesForm } from "./SeriesForm";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";

export default function Series() {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [series, setSeries] = useState([
    { id: 1, title: "Series 1", description: "Description 1" },
    { id: 2, title: "Series 2", description: "Description 2" },
    { id: 3, title: "Series 3", description: "Description 3" },
  ]);

  const handleClose = () => setIsDialogOpen(false);
  const handleSuccess = (newSeries) => {
    setSeries([...series, newSeries]);
    handleClose();
  };

  return (
    <>
      <div className="flex items-center px-4 h-[52px] justify-between">
        <h1 className="text-lg font-medium">Series</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <Button
              size="sm"
              variant="default"
              onClick={() => setIsDialogOpen(true)}
            >
              Add series
            </Button>
          </DialogTrigger>
          <DialogContent>
            <SeriesForm onClose={handleClose} onSuccess={handleSuccess} />
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      <div className="p-4">
        <div className="items-start justify-center gap-6 rounded-lg md:grid lg:grid-cols-3 xl:grid-cols-4">
          {series.map((series) => (
            <SeriesCard key={series.id} {...series} />
          ))}
        </div>
      </div>
    </>
  );
}
