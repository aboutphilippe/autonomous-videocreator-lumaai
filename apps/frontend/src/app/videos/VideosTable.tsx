"use client";

import { columns } from "./columns";
import { DataTable } from "./components/data-table";
import { Button } from "@/app/components/ui/button";
import { useEffect } from "react";
import { Separator } from "@/app/components/ui/separator";
import { useMessage } from "./use-message";

export type ResponseSummary = {
  summary: string;
  bullets: string[];
  priority: string;
  suggestions: {
    cta: string;
    body: string;
  }[];
};

export type MessageType = "TRIAGE" | "REVIEW" | "COMMENT";

export type MessageDb = {
  id: string;
  sourceReferenceId: string;
  type: MessageType;
  key: string;
  title: string;
  body: string;
  url: string | null;
  state: string | null;
  createdAt: Date;
  sourceId: string;
  aiAgentId: string | null;
  authorId: string;
  parentId: string | null;
  teamId: string;
  creatorId: string;
};

const dummyTeamData = {
  id: "team1",
  name: "Team 1",
};

const dummyMessages = [
  {
    id: "msg1",
    key: "key1",
    source: { sourceId: "source1" },
    title: "Message 1",
    body: "This is the body of message 1",
    url: "media/143e022b-d18b-45f2-b639-53f678d05cfa_merged.mp4",
    createdAt: new Date("2023-10-01T00:00:00Z"),
    author: { name: "Author 1" },
    state: "open",
    // labels: [{ name: "good first issue" }],
    // aiItems: [
    //   {
    //     response: {
    //       summary: "Summary 1",
    //       priority: "High",
    //     },
    //   },
    // ],
  },
  // Add more dummy messages as needed
];

export default function VideosTable() {
  const { selectedMessage, selectMessage } = useMessage();

  const teamData = dummyTeamData;
  const teamStatus = "success";

  const messages = dummyMessages;
  const messagesStatus = "success";

  const handleRefreshMessages = async () => {
    // Simulate refresh
    console.log("Messages refreshed");
  };

  const handleRecommendMessages = async () => {
    // Simulate recommend
    console.log("Messages recommended");
  };

  const handleRowClick = (row: { original: { id: string } }) => {
    const message = messages?.find((message) => message.id === row.original.id);
    if (message) {
      selectMessage(message);
    }
  };

  useEffect(() => {
    if (!selectedMessage && messages?.[0]) {
      selectMessage(messages[0]);
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (
        (event.key === "ArrowUp" || event.key === "ArrowDown") &&
        messages &&
        messages.length > 0
      ) {
        event.preventDefault();
        const currentIndex = messages.findIndex(
          (message: MessageDb) => message.id === selectedMessage?.id
        );
        let newIndex = currentIndex;

        if (event.key === "ArrowUp") {
          newIndex = currentIndex > 0 ? currentIndex - 1 : messages.length - 1;
        } else if (event.key === "ArrowDown") {
          newIndex = currentIndex < messages.length - 1 ? currentIndex + 1 : 0;
        }

        const newSelectedMessageId = messages[newIndex]?.id;
        if (newSelectedMessageId) {
          const message = messages?.find(
            (message: MessageDb) => message.id === newSelectedMessageId
          );
          if (message) {
            selectMessage(message);
          }
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [messages, selectedMessage]);

  if (teamStatus !== "success" || messagesStatus !== "success") {
    return <></>;
  }

  const dataTable =
    messages.map((message) => ({
      id: message.id,
      key: message.key,
      source: message.source.sourceId,
      title: message.title,
      body: message.body,
      url: message.url,
      createdAt: message.createdAt,
      // author: {
      //   ...message.author,
      // },
      status: message.state,
      // labels: message.labels,
      // summary: (message.aiItems?.[0]?.response as unknown as ResponseSummary)
      //   ?.summary,
      // priority: (message.aiItems?.[0]?.response as unknown as ResponseSummary)
      //   ?.priority,
    })) ?? [];

  // const filteredDataTable = dataTable.filter((item) =>
  //   item.labels.some((label) => label.name === "good first issue")
  // );

  return (
    <>
      <div className="flex items-center px-4 h-[52px] justify-between ">
        <h1 className="text-lg font-medium">Videos</h1>
        {/* <Button
          variant="secondary"
          size="sm"
          onClick={(event) => {
            event.preventDefault();
            void handleRecommendMessages();
          }}
          disabled={`isRe`commending}
        >
          {isRecommending ? 'Recommending' : 'Recommend'}
        </Button> */}
        <Button
          variant="secondary"
          size="sm"
          onClick={(event) => {
            event.preventDefault();
            void handleRefreshMessages();
          }}
          disabled={false}
        >
          "Refresh"
        </Button>
      </div>
      <Separator />
      <div className="p-4">
        {/* <ScrollArea className="p-4">
          <ScrollBar orientation="vertical" className="invisible" /> */}
        <DataTable
          data={dataTable}
          columns={columns}
          onRowClick={handleRowClick}
          selectedRowId={selectedMessage?.id}
        />
        {/* </ScrollArea> */}
      </div>
    </>
  );
}
