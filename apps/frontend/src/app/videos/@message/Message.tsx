"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
// import Markdown from 'react-markdown';

import Image from "next/image";
import { Button } from "@/app/components/ui/button";
import { LabelColor } from "@/app/components/ui/label";
import { useMessage } from "../use-message";
import { Separator } from "@/app/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/app/components/ui/tooltip";
import { MoreVertical } from "lucide-react";
import { OpenInNewWindowIcon, ReloadIcon } from "@radix-ui/react-icons";
import { Textarea } from "@/app/components/ui/textarea";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/app/components/ui/dropdown-menu";

export type ResponseSummary = {
  summary: string;
  bullets: string[];
  priority: string;
  suggestions: {
    cta: string;
    body: string;
  }[];
};

export function MessageContent({ messageId }: { messageId: string }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [areBulletsVisible, setAreBulletsVisible] = useState(false);
  const [visibleSuggestionIndex, setVisibleSuggestionIndex] = useState<
    number | null
  >(null);

  const dummyMessage = {
    id: "msg1",
    key: "key1",
    source: { sourceId: "owner/repo" },
    title: "Dummy Message Title",
    body: "This is the body of the dummy message.",
    url: "http://example.com",
    author: { handle: "dummyAuthor", imageUrl: "http://example.com/image.jpg" },
    labels: [{ name: "label1", color: "blue" }],
    aiItems: [
      {
        type: "SUMMARY",
        response: {
          summary: "This is a summary.",
          bullets: ["Bullet 1", "Bullet 2"],
          priority: "High",
          suggestions: [
            { cta: "Suggestion 1", body: "Suggestion body 1" },
            { cta: "Suggestion 2", body: "Suggestion body 2" },
          ],
        },
      },
    ],
    children: [
      {
        id: "comment1",
        author: {
          handle: "commentAuthor",
          imageUrl: "http://example.com/comment-image.jpg",
        },
        body: "This is a comment.",
      },
    ],
  };

  const dummySimilarMessages = [
    { title: "Similar Message 1" },
    { title: "Similar Message 2" },
  ];

  const message = dummyMessage;
  const messageStatus = "success";
  const similarMessages = dummySimilarMessages;

  const handleAiMessage = async () => {
    // Simulate AI message handling
    console.log("AI message handled");
  };

  useEffect(() => {
    const toggleBulletsVisibility = (event: KeyboardEvent) => {
      if (event.key === "m" || event.key === "M") {
        setAreBulletsVisible((prev) => !prev);
      }
    };

    window.addEventListener("keydown", toggleBulletsVisibility);

    return () => {
      window.removeEventListener("keydown", toggleBulletsVisibility);
    };
  }, []);

  return (
    messageStatus === "success" &&
    message && (
      <>
        <div className="flex items-center px-4 py-2 h-[52px]">
          <h2 className="text-md">{message.key}</h2>
          <div className="ml-auto flex items-center gap-2">
            <Link className="text-xs" href={message.url!} target="_blank">
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button variant="ghost" size="icon">
                    <OpenInNewWindowIcon className="h-4 w-4" />
                    <span className="sr-only">Open</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  Open on {message.source.sourceId}
                </TooltipContent>
              </Tooltip>
            </Link>
          </div>
          <Separator orientation="vertical" className="mx-2 h-6" />
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" disabled={!messageId}>
                <MoreVertical className="h-4 w-4" />
                <span className="sr-only">More</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={handleAiMessage}>
                Augment with AI
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <Separator />
        <div className="flex flex-col h-full justify-between max-h-[calc(100vh-53px)] p-4">
          <div className="max-w-full w-full flex-1 flex overflow-scroll">
            <div className="p-4 pr-8 space-y-5 max-w-full h-0 grow">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  {message.labels.map((label, index) => (
                    <div key={index}>
                      <LabelColor
                        name={label.name ?? ""}
                        color={label.color ?? ""}
                      />
                    </div>
                  ))}
                </div>
              </div>
              <div className="p-4 bg-gradient-to-br from-blue-200 to-blue-100 dark:from-blue-900/50 dark:to-blue-950/50 rounded-lg space-y-5">
                {message.aiItems &&
                  message.aiItems.map((aiItem, index) => {
                    if (aiItem.type === "SUMMARY") {
                      const response =
                        aiItem.response as unknown as ResponseSummary;
                      return (
                        <div key={index} className="space-y-5">
                          <div className="space-y-2">
                            <p className="text-xs font-medium uppercase text-blue-500 dark:text-blue-400/50">
                              AI Summary
                            </p>
                            <p
                              onClick={() =>
                                setAreBulletsVisible(!areBulletsVisible)
                              }
                            >
                              {response.summary}{" "}
                              <Button variant="secondary">
                                M - {areBulletsVisible ? "Collapse" : "Expand"}
                              </Button>
                            </p>
                            {areBulletsVisible && (
                              <ul className="text-sm list-disc dark:text-neutral-300 space-y-1 px-4">
                                {response.bullets.map((bullet, bulletIndex) => (
                                  <li key={bulletIndex}>{bullet}</li>
                                ))}
                              </ul>
                            )}
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-medium uppercase text-blue-500 dark:text-blue-400/50">
                              AI Priority
                            </p>
                            <p>{response.priority}</p>
                          </div>
                          <div className="space-y-2">
                            <p className="text-xs font-medium uppercase text-blue-500 dark:text-blue-400/50">
                              AI Suggestions
                            </p>
                            <div className="space-y-2">
                              {response.suggestions?.map(
                                (suggestion, suggestionIndex) => {
                                  return (
                                    <>
                                      <div
                                        key={suggestionIndex}
                                        className="flex"
                                      >
                                        <Button
                                          variant="secondary"
                                          onClick={() =>
                                            setVisibleSuggestionIndex(
                                              visibleSuggestionIndex ===
                                                suggestionIndex
                                                ? null
                                                : suggestionIndex
                                            )
                                          }
                                        >
                                          {suggestion.cta}
                                        </Button>
                                      </div>
                                      <div>
                                        {visibleSuggestionIndex ===
                                          suggestionIndex && (
                                          <div>{suggestion.body}</div>
                                        )}
                                      </div>
                                    </>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        </div>
                      );
                    }
                    return null;
                  })}
                {similarMessages && similarMessages.length > 1 && (
                  <div className="space-y-2">
                    <p className="text-xs font-medium uppercase text-blue-500 dark:text-blue-400/50">
                      AI Similar
                    </p>
                    <ul className="text-sm list-disc dark:text-neutral-300 space-y-1 px-4">
                      {similarMessages.map(
                        (similarMessage, similarMessageIndex) => (
                          <li key={similarMessageIndex}>
                            {similarMessage.title}
                          </li>
                        )
                      )}
                    </ul>
                  </div>
                )}
              </div>
              <div className="p-4 bg-neutral-100 dark:bg-neutral-900 rounded-lg space-y-5">
                <p className="text-xs font-medium uppercase dark:text-neutral-400/50">
                  Context
                </p>
                <div style={{ display: "flex", alignItems: "center" }}>
                  <Image
                    src={message.author?.imageUrl ?? ""}
                    alt={message.author?.handle}
                    width={20}
                    height={20}
                    className="h-5 w-5 rounded-full mr-2"
                  />
                  {message.author?.handle}
                </div>
                <div
                  className={`${!isExpanded ? "max-h-48 overflow-hidden" : ""}`}
                >
                  <p className="markdown text-xl space-y-4 dark:text-neutral-300 mb-4">
                    {message.title}
                  </p>
                  <p className="markdown text-xs space-y-4 dark:text-neutral-300 mb-4">
                    {message.body}
                  </p>
                </div>
                <Button
                  variant="secondary"
                  onClick={() => setIsExpanded(!isExpanded)}
                >
                  {isExpanded ? "Collapse" : "Expand"}
                </Button>
              </div>
              <div className="p-4 dark:bg-neutral-900 rounded-lg space-y-5">
                <p className="text-xs font-medium uppercase dark:text-neutral-400/50">
                  Activity
                </p>
                <div className="space-y-5">
                  {message?.children.map((comment) => (
                    <div className="p-5 dark:bg-neutral-800" key={comment.id}>
                      <div style={{ display: "flex", alignItems: "center" }}>
                        <Image
                          src={comment.author?.imageUrl ?? ""}
                          alt={comment.author?.handle}
                          width={20}
                          height={20}
                          className="h-5 w-5 rounded-full mr-2"
                        />
                        {comment.author?.handle}
                      </div>
                      <div
                        className={`${!isExpanded ? "max-h-48 overflow-hidden" : ""}`}
                      >
                        <p className="text-base space-y-4 dark:text-neutral-300">
                          {comment?.body}
                        </p>
                      </div>
                      <Button
                        variant="secondary"
                        onClick={() => setIsExpanded(!isExpanded)}
                      >
                        {isExpanded ? "Collapse" : "Expand"}
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div>
            <Separator className="mt-auto" />
            <div className="p-4 bg-white dark:bg-neutral-900 z-50">
              <div className="max-w-3xl mx-auto w-full">
                <form>
                  <div className="grid gap-4">
                    <Textarea className="p-4" placeholder={`Ask AI ...`} />
                    <div className="flex justify-end">
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            onClick={(e) => e.preventDefault()}
                            size="sm"
                            className="ml-4"
                            disabled={isAssigning}
                          >
                            {isAssigning ? (
                              <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
                            ) : null}
                            {isAssigning ? "Assigning" : "Assign to"}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuGroup>
                            <DropdownMenuItem>Autocode Rover</DropdownMenuItem>
                            <DropdownMenuItem>Bloop</DropdownMenuItem>
                            <DropdownMenuItem>Continue</DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() =>
                                assign({
                                  owner,
                                  repo,
                                  issueId: message.sourceReferenceId,
                                })
                              }
                            >
                              Devin
                            </DropdownMenuItem>
                            <DropdownMenuItem>DevOps agent</DropdownMenuItem>
                            <DropdownMenuItem>OpenDevin</DropdownMenuItem>
                            <DropdownMenuItem>React agent</DropdownMenuItem>
                            <DropdownMenuItem>Swe agent</DropdownMenuItem>
                            <DropdownMenuItem>Sweep</DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem>Assign to all</DropdownMenuItem>
                          </DropdownMenuGroup>
                        </DropdownMenuContent>
                      </DropdownMenu>
                      <Button
                        onClick={(e) => e.preventDefault()}
                        size="sm"
                        className="ml-4"
                      >
                        Ask AI
                      </Button>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </>
    )
  );
}

export function Message() {
  const { selectedMessage } = useMessage();

  return (
    selectedMessage?.id && <MessageContent messageId={selectedMessage?.id} />
  );
}
