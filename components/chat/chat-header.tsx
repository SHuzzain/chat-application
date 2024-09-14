import { Hash, Menu } from "lucide-react";
import React from "react";
import MobileToggle from "@/components/common/mobile-toggle";
import UserAvatar from "@/components/common/user-avatar";
import SocketIndicator from "@/components/common/socket-indicator";

type Props = {
  serverId: string;
  name: string;
  type: "channels" | "conversation";
  imageUrl?: string;
};

const ChatHeader = ({ imageUrl, name, serverId, type }: Props) => {
  return (
    <div className="flex items-center border-neutral-200 dark:border-neutral-800 px-3 border-b-2 h-12 font-semibold text-md">
      <aside>
        <MobileToggle serverId={serverId} />
      </aside>
      {type === "channels" && (
        <Hash className="mr-2 text-zinc-500 dark:text-zinc-400 size-5" />
      )}
      {type === "conversation" && imageUrl && (
        <UserAvatar src={imageUrl} className="mr-2 size-8 md:size-8" />
      )}
      <p className="font-semibold text-black text-md dark:text-white">{name}</p>

      <div className="flex items-center ml-auto">
        <SocketIndicator />
      </div>
    </div>
  );
};

export default ChatHeader;
