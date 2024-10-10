"use server";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import Series from "./series/page";
import Videos from "./videos/page";
import { getUser } from "@/utils/supabase/server";
import { redirect } from "next/navigation";
import { UserNav } from "./components/user-nav";

export default async function Home() {
  const { user } = await getUser();
  if (!user) {
    redirect("/login");
  }

  return (
    <div>
      <main className="py-4">
        <Tabs defaultValue="videos">
          <div className="flex items-center w-full justify-between px-4 py-2 h-[52px]">
            <TabsList>
              <TabsTrigger
                value="videos"
                className="text-neutral-600 dark:text-neutral-200"
              >
                Videos
              </TabsTrigger>
              <TabsTrigger
                value="series"
                className="text-neutral-600 dark:text-neutral-200"
              >
                Series
              </TabsTrigger>
            </TabsList>
            <div className="flex items-center gap-2">
              <UserNav user={user} />
            </div>
          </div>
          <TabsContent value="series" className="m-0">
            <Series />
          </TabsContent>
          <TabsContent value="videos" className="m-0">
            <Videos />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
