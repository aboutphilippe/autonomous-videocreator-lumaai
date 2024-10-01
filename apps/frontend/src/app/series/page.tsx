import { Metadata } from "next";
import Series from "./Series";

export const metadata: Metadata = {
  title: "Series",
};

export default async function Page() {
  return (
    <>
      <Series />
    </>
  );
}
