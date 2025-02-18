import React from "react";
import {
  ChatHeaderLoader,
  ChatInputLoader,
  ChatMessageLoader,
} from "@/app/(main)/(routes)/server/[serverId]/_component/loader-action";

const Loading = () => {
  return (
    <div className="flex flex-col bg-white dark:bg-[#313338] h-full">
      <ChatHeaderLoader type="conversation" />
      <ChatMessageLoader />
      <ChatInputLoader />
    </div>
  );
};

export default Loading;
