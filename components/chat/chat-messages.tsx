"use client";
import React, { ElementRef, Fragment, useRef } from "react";

import { Loader2, ServerCrash } from "lucide-react";

import { useChatQuery } from "@/hook/use-chat-query";
import { useChatSocket } from "@/hook/use-chat-socket";

import ChatWelcome from "@/components/chat/chat-welcome";
import ChatItem from "@/components/chat/chat-item";
import { Button } from "@/components/ui/button";

import { format } from "date-fns";
import { Member, Message, Profile } from "@prisma/client";
import { ReloadIcon } from "@radix-ui/react-icons";
import { useIntersectionObserver } from "@/hook/use-intersection-observer";

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
  const addKey = `chat:${chatId}:messages`;
  const updateKey = `chat:${chatId}:messages:updated`;

  const chatRef = useRef<ElementRef<"div">>(null);
  const bottomRef = useRef<ElementRef<"div">>(null);

  const { data, status, hasNextPage, fetchNextPage, isFetchingNextPage } =
    useChatQuery({
      queryKey,
      apiUrl,
      paramKey,
      paramValue,
    });

  const [ref] = useIntersectionObserver<"button">({
    root: null,
    rootMargin: "100px",
    threshold: 0.5,
    onIntersect: () => {
      fetchNextPage && fetchNextPage();
    },
  });

  useChatSocket({ addKey, queryKey, updateKey });

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
    <div ref={chatRef} className="flex flex-col flex-1 py-4 overflow-y-auto">
      {!hasNextPage && (
        <>
          <div className="flex-1" />
          <ChatWelcome name={name} type={type} />
        </>
      )}

      {hasNextPage && (
        <div className="flex justify-center">
          {isFetchingNextPage ? (
            <Loader2 className="my-4 text-zinc-500 animate-spin size-6" />
          ) : (
            <Button
              ref={ref}
              onClick={() => fetchNextPage()}
              className="my-4 text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-400 transition"
              size={"sm"}
              variant={"link"}
            >
              Load pervious messages <ReloadIcon className="ml-3 size-3" />
            </Button>
          )}
        </div>
      )}

      <div className="flex flex-col-reverse mt-auto">
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
      <div ref={bottomRef} />
    </div>
  );
};

export default ChatMessages;
