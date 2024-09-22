"use client";
import React, { Fragment } from "react";

import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hook/use-chat-query";
import { Member, Message, Profile } from "@prisma/client";

import ChatWelcome from "@/components/chat/chat-welcome";
import ChatItem from "@/components/chat/chat-item";

import { format } from "date-fns";

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

interface MessagesWithMemberAndProfile extends Message {
  member: Member & {
    profile: Profile;
  };
}

const DATE_FORMAT = "d MMM yyy, HH:mm";

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
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useChatQuery({ queryKey, apiUrl, paramKey, paramValue });

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
      <div className="flex flex-col flex-1 justify-end">
        <ChatWelcome name={name} type={type} />
        <div className="flex flex-col-reverse items-start">
          {data?.pages?.map(
            (group: { items: MessagesWithMemberAndProfile[] }, i) => (
              <Fragment key={i}>
                {group.items?.map((message) => (
                  <ChatItem
                    key={message.id}
                    id={message.id}
                    content={message.content}
                    member={message.member}
                    fileUrl={message.fileUrl}
                    currentMember={member}
                    deleted={message.deleted}
                    timestamp={format(new Date(message.createdAt), DATE_FORMAT)}
                    isUpdated={message.createdAt !== message.updatedAt}
                    socketUrl={socketUrl}
                    socketQuery={socketQuery}
                  />
                ))}
              </Fragment>
            )
          )}
        </div>
      </div>
    </div>
  );
};

export default ChatMessages;
