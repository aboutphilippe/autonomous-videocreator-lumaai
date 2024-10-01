"use client";

import React, { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { triggerWorkflow } from "../actions/trigger";
import { Textarea } from "../components/ui/textarea";

interface SeriesFormProps {
  onClose: () => void;
  onSuccess: (newSeries: any) => void;
}

type ImagePreview = {
  url: string;
  width: number;
  height: number;
  content_type: string;
};

export function SeriesForm({ onClose, onSuccess }: SeriesFormProps) {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [amount, setAmount] = useState(6);
  const [imagePreviews, setImagePreviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const handleGenerateSeries = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const workflowResult = await triggerWorkflow("createSeries", {
      title,
      prompt,
      amount,
    });
    console.log("workflowResult", workflowResult);
    setImagePreviews(workflowResult.output.imagePreviews);
    onSuccess(workflowResult);
    setLoading(false);
  };

  return (
    <div className="flex">
      <form onSubmit={handleGenerateSeries} className="w-1/3 p-4">
        <div className="grid gap-4">
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Series title"
            />
          </div>
          <div>
            <Label htmlFor="prompt">Prompt</Label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="cute bunnies"
              rows={12}
            />
          </div>
          <div>
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="6"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" disabled={loading || imagePreviews.length > 0}>
            {loading ? "Generating..." : "Generate"}
          </Button>
        </div>
      </form>
      <div className="w-2/3 p-4">
        <div>
          {!!loading && (
            <div className="space-y-5">
              <h2>Previews</h2>
              <p className="text-center text-gray-500">Loading...</p>
            </div>
          )}
          {imagePreviews.length > 0 && (
            <div className="space-y-5">
              <h2>Previews</h2>
              <div className="grid grid-cols-3 gap-4">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="space-y-2">
                    <h3>{preview.title}</h3>
                    {preview.images.map(
                      (image: ImagePreview, imgIndex: number) => (
                        <img
                          key={imgIndex}
                          src={image.url}
                          alt={preview.title}
                          width={image.width}
                          height={image.height}
                          className="rounded-md"
                        />
                      )
                    )}
                    <p className="text-sm text-gray-500 line-clamp-2 hover:line-clamp-none">
                      {preview.imagePrompt}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
