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
import { format } from "date-fns";
import Link from "next/link";
import { MoreVertical } from "lucide-react";

// Define the Series type
export interface Series {
  id: number;
  type: string;
  seriesId: string;
  name: string;
  url: string;
  description: string;
  createdAt: Date;
  enabled: boolean;
}

export function SeriesCard({
  id,
  type,
  seriesId,
  name,
  url,
  description,
  createdAt,
  enabled,
}: Series) {
  return (
    <Card>
      <CardHeader className="space-y-5">
        <div className="flex justify-between items-center">
          <CardTitle className={!enabled ? "opacity-50" : ""}>{name}</CardTitle>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>
                <Link href={url} target="_blank">
                  Visit
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>
                {enabled ? "Disable" : "Enable"}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => {}}>Delete</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <CardDescription className="line-clamp-2 pr-10 h-10">
          {description}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex space-x-5 text-sm text-muted-foreground">
          <div>
            <Link
              className="flex items-center text-sm transition-colors hover:text-primary"
              href={url ?? "#"}
              target="_blank"
            >
              {seriesId}
            </Link>
          </div>
          <div>{createdAt && format(createdAt, "d MMM yyyy")}</div>
        </div>
      </CardContent>
    </Card>
  );
}
