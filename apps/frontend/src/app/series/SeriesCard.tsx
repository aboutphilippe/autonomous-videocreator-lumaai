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
import { MoreVertical } from "lucide-react";
import Image from "next/image";
import { triggerWorkflow } from "../actions/trigger";
import { SerieType } from "./page";

export function SeriesCard({
  series,
  enabled,
}: {
  series: SerieType;
  enabled?: boolean;
}) {
  const { title, prompt, images } = series;

  console.log("images", images);
  const imageUrl = images[0].url;

  const handleCreateVideos = async (event: React.FormEvent) => {
    const workflowPromises = images.map((image) =>
      triggerWorkflow("createVideo", {
        title: image.title,
        prompt: image.prompt,
        fromImageUrl: image.url,
        uploadToYoutube: false,
        seriesId: series.id,
      })
    );

    const workflowResults = await Promise.all(workflowPromises);
    console.log("workflowResults", workflowResults);
  };

  const handleDelete = () => {
    // todo
  };

  return (
    <Card key={series.id}>
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
