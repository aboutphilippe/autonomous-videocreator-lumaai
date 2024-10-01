import { Metadata } from "next";
import VideosTable from "./VideosTable";

export const metadata: Metadata = {
  title: "Videos",
  description: "Videos produced.",
};

export default async function Videos() {
  return <VideosTable />;
}
