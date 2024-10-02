import { Button } from "@/app/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/app/components/ui/card";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";
import Link from "next/link";
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { triggerWorkflow } from "../actions/trigger";
import { SeriesType } from "./Series";

export function SeriesCard({
  series,
  enabled,
}: {
  series: SeriesType;
  enabled?: boolean;
}) {
  const { workflowId, runId, output } = series;
  const { title, prompt, imagePreviews, playlistId } = output;

  console.log("imagePreviews", imagePreviews);
  const imageUrl = imagePreviews[0].images[0].url;

  const engineUrl = `http://localhost:5233/?workflowId=${workflowId}&runId=${runId}`;

  const handleCreateVideos = async (event: React.FormEvent) => {
    const workflowPromises = imagePreviews.map((imagePreview) =>
      triggerWorkflow("createVideo", {
        title: imagePreview.title,
        prompt: imagePreview.imagePrompt,
        fromImageUrl: imagePreview.images[0].url,
        uploadToYoutube: false,
      })
    );

    const workflowResults = await Promise.all(workflowPromises);
    console.log("workflowResults", workflowResults);
  };

  const handleDelete = () => {
    const storedSeries = JSON.parse(localStorage.getItem("series") || "[]");
    const updatedSeries = storedSeries.filter(
      (item: SeriesType) =>
        item.workflowId !== series.workflowId || item.runId !== series.runId
    );
    localStorage.setItem("series", JSON.stringify(updatedSeries));
    console.log(
      `Deleted series with workflowId: ${series.workflowId} and runId: ${series.runId}`
    );
  };

  return (
    <Card key={series.runId}>
      <CardHeader className="space-y-5">
        <div className="flex justify-between items-center">
          <CardTitle className={!enabled ? "opacity-50" : ""}>
            {title}
          </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={engineUrl} target="_blank">
                  Open in Engine
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleCreateVideos}>
                Start creating videos
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                {enabled ? "Disable" : "Enable"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardContent>
          <Image
            src={imageUrl}
            alt={title}
            width={160}
            height={90}
            className="rounded-md"
          />
        </CardContent>
        <CardDescription className="line-clamp-3 hover:line-clamp-none pr-10 h-10">
          {prompt}
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
