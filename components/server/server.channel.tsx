"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";

import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";
import { cn } from "@/lib/utils";
import ActionTooltip from "../ui/action-tooltip";

type Props = {
  server: Server;
  role?: MemberRole;
  channel: Channel;
};

export const iconMap = {
  [ChannelType.TEXT]: Hash,
  [ChannelType.VOICE]: Mic,
  [ChannelType.VIDEO]: Video,
};

const ServerChannel = ({ channel, role, server }: Props) => {
  const params = useParams();
  const router = useRouter();

  const Icon = iconMap[channel.type];
  return (
    <button
      className={cn(
        `flex items-center group p-2 rounded-md gap-x-2 
        w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700 mb-1`,
        params?.channeId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700 "
      )}
    >
      <Icon className="flex-shrink-0 text-zinc-500 dark:text-zinc-400 size-5" />
      <p
        title={channel.name}
        className={cn(
          `line-clamp-1 font-semibold text-sm text-zinc-500 
        group-hover:text-zinc-600 dark:text-zinc-400 
        dark:group-hover:text-zinc-300 transition`,
          params?.channeId === channel.id &&
            "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {channel.name}
      </p>
      {channel.name !== "general" && role !== MemberRole.GUEST && (
        <div className="flex items-center gap-x-2 ml-auto">
          <ActionTooltip label="Edit">
            <Edit className="group-hover:block hidden text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-400 transition size-4" />
          </ActionTooltip>
          <ActionTooltip label="Delete">
            <Trash className="group-hover:block hidden text-zinc-400 hover:text-rose-600 dark:hover:text-rose-500 dark:text-zinc-400 transition size-4" />
          </ActionTooltip>
        </div>
      )}
      {channel.name === "general" && (
        <Lock className="ml-auto text-zinc-500 size-4" />
      )}
    </button>
  );
};

export default ServerChannel;
