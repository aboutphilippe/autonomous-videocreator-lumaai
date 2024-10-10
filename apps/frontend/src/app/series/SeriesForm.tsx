"use client";

import React, { useState } from "react";

import { Button } from "@/app/components/ui/button";
import { Input } from "@/app/components/ui/input";
import { Label } from "@/app/components/ui/label";
import { triggerWorkflow } from "../actions/trigger";
import { Textarea } from "../components/ui/textarea";

interface SeriesFormProps {
  onClose: () => void;
}

type ImagePreview = {
  url: string;
  width: number;
  height: number;
  content_type: string;
};

export function SeriesForm({ onClose }: SeriesFormProps) {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [amount, setAmount] = useState(3);
  const [serieId, setSerieId] = useState("");
  const [imagePreviews, setImagePreviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [launching, setLaunching] = useState(false);

  const handleGenerateSeries = async (event: React.FormEvent) => {
    event.preventDefault();
    setLoading(true);
    const workflowResult = await triggerWorkflow("generateSerie", {
      ...(serieId && { serieId }),
      title,
      prompt,
      amount,
    });
    console.log("workflowResult", workflowResult);
    setImagePreviews(workflowResult.output.imagePreviews);
    setSerieId(workflowResult.output.upsertedSerie.serie[0].id);
    setLoading(false);
  };

  const handleLaunching = async () => {
    if (serieId) {
      setLaunching(true);
      const workflowResult = await triggerWorkflow("launchSerie", {
        serieId,
        createPlaylist: false,
      });
      console.log("workflowResult", workflowResult);
      setLaunching(false);
      onClose();
    }
  };

  const handleVideo = async ({
    preview,
    image,
  }: {
    preview: any;
    image: any;
  }) => {
    if (serieId) {
      const workflowResult = await triggerWorkflow("createVideo", {
        serieId,
        title: preview.title,
        prompt: preview.imagePrompt,
        fromImageUrl: image.url,
        uploadToYoutube: false,
      });
      console.log("workflowResult", workflowResult);
    }
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
            <Label htmlFor="amount">Previews amount</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(Number(e.target.value))}
              placeholder="3"
            />
          </div>
        </div>
        <div className="flex justify-end mt-4 gap-2">
          <Button variant="secondary" type="button" onClick={onClose}>
            Close
          </Button>
          <Button type="submit" disabled={loading}>
            {loading
              ? "Generating..."
              : `Generate ${imagePreviews.length > 0 ? "again" : ""}`}
          </Button>
          {serieId && (
            <Button
              type="button"
              onClick={() => {
                handleLaunching();
              }}
              disabled={loading || launching || imagePreviews.length === 0}
            >
              {launching ? "Launching..." : "Launch"}
            </Button>
          )}
        </div>
      </form>
      <div className="w-2/3 p-4">
        <div>
          <div className="space-y-5">
            <h2>Previews</h2>
            {imagePreviews.length == 0 && (
              <p className="text-center text-neutral-500">
                {loading ? "Generating " : "Generate to see "}thumbnail
                previews.
              </p>
            )}
            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-3 gap-4 overflow-y-auto max-h-dvh">
                {imagePreviews.map((preview, index) => (
                  <div key={index} className="space-y-2 relative group">
                    <h3 className="h-20 line-clamp-2">{preview.title}</h3>
                    {preview.images.map(
                      (image: ImagePreview, imgIndex: number) => (
                        <div key={imgIndex} className="relative">
                          <img
                            src={image.url}
                            alt={preview.title}
                            width={image.width}
                            height={image.height}
                            className="rounded-md"
                          />
                          <button
                            onClick={() => handleVideo({ preview, image })}
                            className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            Create Video
                          </button>
                        </div>
                      )
                    )}
                    <p className="text-sm text-neutral-500 line-clamp-2 hover:line-clamp-none">
                      {preview.imagePrompt}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
