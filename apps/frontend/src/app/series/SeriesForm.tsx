"use client";

import React, { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";

interface SeriesFormProps {
  onClose: () => void;
  onSuccess: () => void;
}

export function SeriesForm({ onClose, onSuccess }: SeriesFormProps) {
  const [url, setUrl] = useState("");

  const handleSaveSeries = async (event: React.FormEvent) => {
    event.preventDefault();
  };

  return (
    <form onSubmit={handleSaveSeries}>
      <div className="grid gap-4 p-4">
        <Label htmlFor="url">URL</Label>
        <Input
          id="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
        />
      </div>
      <div className="flex justify-end p-4">
        <Button type="submit">Add series</Button>
      </div>
    </form>
  );
}
