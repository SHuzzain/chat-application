"use client";

import { Member } from "@prisma/client";
import React from "react";
import ChatWelcome from "./chat-welcome";
import { useChatQuery } from "@/hook/use-chat-query";
import { Loader2, ServerCrash } from "lucide-react";

type Props = {
  name: string;
  member: Member;
  chatId: string;
  apiUrl: string;
  socketUrl: string;
  socketQuery: Record<string, any>;
  type: "conversation" | "channel";
  paramKey: "channelId" | "conversationId";
  paramValue: string;
};

const ChatMessages = (props: Props) => {
  const {
    apiUrl,
    chatId,
    member,
    name,
    paramKey,
    paramValue,
    socketQuery,
    socketUrl,
    type,
  } = props;
  const queryKey = `chat:${chatId}`;
  const {
    data,
    error,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
  } = useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

  console.log({ status });

  if (status === "pending") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center gap-2">
        <Loader2 className="text-zinc-500 animate-spin size-7" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Loading Messgaes...
        </p>
      </div>
    );
  }

  if (status === "error") {
    return (
      <div className="flex flex-col flex-1 justify-center items-center gap-2">
        <ServerCrash className="text-zinc-500 size-7" />
        <p className="text-xs text-zinc-500 dark:text-zinc-400">
          Something went wrong!
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col flex-1 py-4 overflow-y-auto">
      <div className="flex flex-1 items-end">
        <ChatWelcome name={name} type={type} />
      </div>
    </div>
  );
};

export default ChatMessages;
