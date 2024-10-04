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
import { Dialog, DialogContent, DialogTrigger } from "../components/ui/dialog";
import { useState } from "react";
import { SeriePreviews } from "./SeriePreviews";

export function SeriesCard({ series }: { series: SerieType }) {
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const { title, prompt, images, status } = series;

  console.log("images", images);
  const imageUrl = images[0].url;

  const handleCreateVideos = async (event: React.FormEvent) => {
    const workflowResult = await triggerWorkflow("launchSerie", {
      serieId: series.id,
      createPlaylist: false,
    });
    console.log("workflowResult", workflowResult);
  };

  const handleDelete = () => {
    // todo
  };

  const handleClose = () => setIsDialogOpen(false);

  return (
    <Card key={series.id}>
      <CardHeader className="space-y-5">
        <div className="flex justify-between items-center">
          <CardTitle>{title} </CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {status === "NEW" && (
                <DropdownMenuItem onClick={handleCreateVideos}>
                  Launch
                </DropdownMenuItem>
              )}
              {status === "LIVE" && (
                <DropdownMenuItem onClick={() => {}}>Pause</DropdownMenuItem>
              )}
              {status === "PAUSED" && (
                <DropdownMenuItem onClick={() => {}}>Resume</DropdownMenuItem>
              )}
              <DropdownMenuItem onClick={handleDelete}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardContent>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Image
                src={imageUrl}
                alt={title}
                width={180}
                height={320}
                className="rounded-md shadow-md"
              />
            </DialogTrigger>
            <DialogContent>
              <SeriePreviews serie={series} onClose={handleClose} />
            </DialogContent>
          </Dialog>
        </CardContent>
        <CardDescription className="line-clamp-6 hover:line-clamp-none">
          <p>{status}</p>
          <p>{prompt}</p>
        </CardDescription>
      </CardHeader>
    </Card>
  );
}
