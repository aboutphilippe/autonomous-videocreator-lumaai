"use client";

import React from "react";

import { triggerWorkflow } from "../actions/trigger";
import { SerieType } from "./page";

export function SeriePreviews({
  serie,
  onClose,
}: {
  serie: SerieType;
  onClose: () => void;
}) {
  const handleVideo = async ({ image }: { image: SerieType["images"][0] }) => {
    if (serie.id) {
      const workflowResult = await triggerWorkflow("createVideo", {
        serieId: serie.id,
        title: image.title,
        prompt: image.prompt,
        fromImageUrl: image.url,
        uploadToYoutube: false,
      });
      console.log("workflowResult", workflowResult);
    }
  };

  return (
    <div className="flex">
      <div className="p-4">
        <div>
          <div className="space-y-5">
            <h2>Previews</h2>
            {serie.images.length > 0 && (
              <div className="grid grid-cols-4 gap-4 overflow-y-auto max-h-dvh">
                {serie.images.map((image) => (
                  <div key={image.id} className="space-y-2 relative group">
                    <h3 className="h-20 line-clamp-2">{image.title}</h3>

                    <div className="relative">
                      <img
                        src={image.url}
                        alt={image.title}
                        width={image.width}
                        height={image.height}
                        className="rounded-md"
                      />
                      <button
                        onClick={() => handleVideo({ image })}
                        className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 text-white opacity-0 group-hover:opacity-100 transition-opacity"
                      >
                        Create Video
                      </button>
                    </div>
                    <p className="text-sm text-neutral-500 line-clamp-2 hover:line-clamp-none">
                      {image.prompt}
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
