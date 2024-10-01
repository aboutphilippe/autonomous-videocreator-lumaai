import { Tabs, TabsContent, TabsList, TabsTrigger } from "./components/ui/tabs";
import SignIn from "./components/sign-in";
import Series from "./series/Series";
import Videos from "./videos/page";
import { ThemeToggle } from "./components/theme-toggle";

export default function Home() {
  return (
    <div>
      <main className="py-4">
        <Tabs defaultValue="series">
          <div className="flex items-center w-full justify-between px-4 py-2 h-[52px]">
            <TabsList>
              <TabsTrigger
                value="series"
                className="text-neutral-600 dark:text-neutral-200"
              >
                Series
              </TabsTrigger>
              <TabsTrigger
                value="videos"
                className="text-neutral-600 dark:text-neutral-200"
              >
                Videos
              </TabsTrigger>
            </TabsList>
            <ThemeToggle />
          </div>
          <TabsContent value="series" className="m-0">
            <Series />
          </TabsContent>
          <TabsContent value="videos" className="m-0">
            <Videos />
          </TabsContent>
        </Tabs>
        <SignIn />
      </main>
    </div>
  );
}
