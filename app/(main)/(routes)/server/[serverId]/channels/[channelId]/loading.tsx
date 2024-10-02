import React from "react";
import {
  ChatHeaderLoader,
  ChatInputLoader,
  ChatMessageLoader,
} from "@/app/(main)/(routes)/server/[serverId]/_component/loader-action";

type Props = {};

const Loading = (props: Props) => {
  return (
    <div className="flex flex-col bg-white dark:bg-[#313338] h-full">
      <ChatHeaderLoader type="channels" />
      <ChatMessageLoader />
      <ChatInputLoader />
    </div>
  );
};

export default Loading;
