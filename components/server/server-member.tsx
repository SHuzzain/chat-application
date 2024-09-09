"use client";
import React from "react";
import { useParams, useRouter } from "next/navigation";

import { cn } from "@/lib/utils";
import { roleIconMap } from "@/helper";

import { Member, Profile, Server } from "@prisma/client";

import UserAvatar from "@/components/common/user-avatar";

type Props = {
  member: Member & { profile: Profile };
  server: Server;
};

const ServerMember = ({ member, server }: Props) => {
  const params = useParams();
  const router = useRouter()

  const memberRedirect = () => {
    router.push(`/server/${params?.serverId}/conversations/${member.id}`)
  }

  const Icon = roleIconMap[member.role];

  return (
    <button
      onClick={memberRedirect}
      className={cn(
        `flex items-center group p-2 rounded-md gap-x-2 
        w-full hover:bg-zinc-700/10 dark:hover:bg-zinc-700 mb-1`,
        params?.memberId === member.id && "bg-zinc-700/20 dark:bg-zinc-700 "
      )}
    >
      <UserAvatar src={member.profile.imageUrl} className="size-4 md:size-8" />
      <p
        title={member.profile.name}
        className={cn(
          `line-clamp-1 font-semibold text-sm text-zinc-500 
        group-hover:text-zinc-600 dark:text-zinc-400 
        dark:group-hover:text-zinc-300 transition`,
          params?.memberId === member.id &&
          "text-primary dark:text-zinc-200 dark:group-hover:text-white"
        )}
      >
        {member.profile.name}
      </p>

      {Icon}
    </button>
  );
};

export default ServerMember;
