"use client";

import React, { useContext, useState } from "react";
import { Separator } from "@/app/components/ui/separator";
import { SeriesCard } from "./SeriesCard";
import { SeriesForm } from "./SeriesForm";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
} from "@/app/components/ui/dialog";
import { Button } from "@/app/components/ui/button";
import { SerieType } from "./page";

export default function SeriesList({ series }: { series?: SerieType[] }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleClose = () => setIsDialogOpen(false);

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
            <SeriesForm onClose={handleClose} />
          </DialogContent>
        </Dialog>
      </div>
      <Separator />
      <div className="p-4">
        <div className="items-start justify-center gap-6 rounded-lg md:grid lg:grid-cols-3 xl:grid-cols-6">
          {series && series.map((series) => <SeriesCard series={series} />)}
        </div>
      </div>
    </>
  );
}
