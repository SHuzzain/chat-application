"use client";
import React, { useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";

import axios from "axios";
import { Channel, ChannelType, MemberRole, Server } from "@prisma/client";
import qs from "query-string";

import { Edit, Hash, Lock, Mic, Trash, Video } from "lucide-react";

import { cn } from "@/lib/utils";
import ActionTooltip from "@/components/ui/action-tooltip";
import ConfirmModal from "@/components/modals/modal-confirm";
import { useModal } from "@/store/server-slice";
import { onAction } from "@/hook/index";

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

  const { onOpen } = useModal();

  const [confirm, setConfirm] = useState<{
    isOpen: boolean;
    channel?: Channel;
  }>({ isOpen: false });

  const confirmInfo = useMemo(() => {
    const url = qs.stringifyUrl({
      url: `/api/channels/${channel?.id}`,
      query: {
        serverId: params?.serverId,
      },
    });

    const defaultConfirmInfo = {
      title: "",
      description: <></>,
      axiosFunction: () => axios.delete(url),
      redirectPath: `${params?.serverId}`,
    };

    if (!confirm) {
      return defaultConfirmInfo;
    }

    switch (confirm?.channel?.type) {
      case "TEXT":
        defaultConfirmInfo.title = "Delete Text Channel";
        defaultConfirmInfo.description = (
          <>
            Are you sure you want to delete this{" "}
            <span className="font-semibold text-indigo-500">
              {confirm.channel?.name}
            </span>{" "}
            text channel?
          </>
        );

        break;

      case "VOICE":
        defaultConfirmInfo.title = "Delete Voice Channel";
        defaultConfirmInfo.description = (
          <>
            Are you sure you want to delete this{" "}
            <span className="font-semibold text-indigo-500">
              {confirm.channel?.name}
            </span>{" "}
            voice channel?
          </>
        );

        break;

      case "VIDEO":
        defaultConfirmInfo.title = "Delete Video Channel";
        defaultConfirmInfo.description = (
          <>
            Are you sure you want to delete this{" "}
            <span className="font-semibold text-indigo-500">
              {confirm.channel?.name}
            </span>{" "}
            video channel?
          </>
        );

        break;

      default:
        break;
    }

    return defaultConfirmInfo;
  }, [channel?.id, confirm, params?.serverId]);

  const channelRedirect = () => {
    router.push(`/server/${params?.serverId}/channels/${channel?.id}`);
  };

  const Icon = iconMap[channel.type];
  return (
    <>
      <button
        onClick={channelRedirect}
        className={cn(
          `flex items-center group p-2 rounded-md gap-x-2 
        w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700 mb-1`,
          params?.channelId === channel.id && "bg-zinc-700/20 dark:bg-zinc-700 "
        )}
      >
        <Icon className="flex-shrink-0 text-zinc-500 dark:text-zinc-400 size-5" />
        <p
          title={channel.name}
          className={cn(
            `line-clamp-1 font-semibold text-sm text-zinc-500 
        group-hover:text-zinc-600 dark:text-zinc-400 
        dark:group-hover:text-zinc-300 transition`,
            params?.channelId === channel.id &&
              "text-primary dark:text-zinc-200 dark:group-hover:text-white"
          )}
        >
          {channel.name}
        </p>
        {channel.name !== "general" && role !== MemberRole.GUEST && (
          <div className="flex items-center gap-x-2 ml-auto">
            <ActionTooltip label="Edit">
              <Edit
                onClick={(e) =>
                  onAction(e, () => onOpen("createChannel", { channel }))
                }
                className="group-hover:block hidden text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-300 dark:text-zinc-400 transition size-4"
              />
            </ActionTooltip>
            <ActionTooltip label="Delete">
              <Trash
                onClick={(e) =>
                  onAction(e, () => setConfirm({ isOpen: true, channel }))
                }
                className="group-hover:block hidden text-zinc-400 hover:text-rose-600 dark:hover:text-rose-500 dark:text-zinc-400 transition size-4"
              />
            </ActionTooltip>
          </div>
        )}
        {channel.name === "general" && (
          <Lock className="ml-auto text-zinc-500 size-4" />
        )}
      </button>

      {/* confirm modal */}
      <ConfirmModal
        {...confirmInfo}
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ isOpen: false })}
      />
    </>
  );
};

export default ServerChannel;
