"use client";
import React from "react";

import { ChannelType, MemberRole } from "@prisma/client";

import { ServerWithMemberProfile } from "@/types";
import { useModal } from "@/store/server-slice";

import ActionTooltip from "../ui/action-tooltip";
import { Button } from "../ui/button";

import { Plus, Settings } from "lucide-react";

type Props = {
  label: string;
  sectionType: "channels" | "members";
  role?: MemberRole;
  channelType?: ChannelType;
  server?: ServerWithMemberProfile;
};

const ServerSection = ({
  label,
  sectionType,
  channelType,
  role,
  server,
}: Props) => {
  const { onOpen } = useModal();

  return (
    <div className="flex justify-between items-center py-2">
      <p className="font-semibold text-xs text-zinc-500 dark:text-zinc-400 uppercase">
        {label}
      </p>
      {role !== MemberRole.GUEST && sectionType === "channels" && (
        <ActionTooltip
          label="Create Channel"
          tooltip={{ content: { align: "center", side: "top" } }}
        >
          <Button
            onClick={() => {
              onOpen("createChannel", { channel: { type: channelType! } });
            }}
            variant={"ghost"}
            size={"icon"}
            className="rounded-full"
          >
            <Plus className="size-4" />
          </Button>
        </ActionTooltip>
      )}

      {role === MemberRole.ADMIN && sectionType === "members" && (
        <ActionTooltip
          label="Create Member"
          tooltip={{ content: { align: "center", side: "top" } }}
        >
          <Button
            onClick={() => onOpen("member", { server })}
            variant={"ghost"}
            size={"icon"}
            className="rounded-full"
          >
            <Settings className="size-4" />
          </Button>
        </ActionTooltip>
      )}
    </div>
  );
};

export default ServerSection;
