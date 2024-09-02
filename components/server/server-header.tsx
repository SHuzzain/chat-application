"use client";
import { ServerWithMemberProfile } from "@/types";
import { MemberRole } from "@prisma/client";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import {
  ChevronDown,
  PlusCircle,
  Settings,
  Trash2,
  UserPlus,
  Users,
} from "lucide-react";
import { ExitIcon } from "@radix-ui/react-icons";
import { useModal } from "@/store/server-slice";

type Props = {
  server: ServerWithMemberProfile;
  role?: MemberRole;
};

const ServerHeader = ({ server, role }: Props) => {
  const { onOpen } = useModal();

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;
  return (
    <DropdownMenu>
      <DropdownMenuTrigger className="focus:outline-none flex items-center border-2 border-neutral-200 dark:border-neutral-800 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 px-3 w-full h-12 font-semibold text-md transition">
        {server.name}
        <ChevronDown className="ml-auto size-5" />
      </DropdownMenuTrigger>

      <DropdownMenuContent className="w-56 font-medium text-black text-xs dark:text-neutral-400">
        {isModerator && (
          <DropdownMenuItem
            onClick={() => onOpen("invite", { server })}
            className="px-3 py-2 text-indigo-600 dark:text-indigo-400 cursor-pointer"
          >
            Invite People
            <UserPlus className="ml-auto size-4" />
          </DropdownMenuItem>
        )}
        {isAdmin && (
          <>
            <DropdownMenuItem
              onClick={() => onOpen("createServer", { server })}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Server Setting
              <Settings className="ml-auto size-4" />
            </DropdownMenuItem>

            <DropdownMenuItem
              onClick={() => onOpen("member", { server })}
              className="px-3 py-2 text-sm cursor-pointer"
            >
              Manage Mambers
              <Users className="ml-auto size-4" />
            </DropdownMenuItem>
          </>
        )}

        {isModerator && (
          <>
            <DropdownMenuItem className="px-3 py-2 cursor-pointer">
              Create Channel
              <PlusCircle className="ml-auto size-4" />
            </DropdownMenuItem>

            <DropdownMenuSeparator />
          </>
        )}

        {isAdmin && (
          <>
            <DropdownMenuItem className="px-3 py-2 text-rose-500 text-sm cursor-pointer">
              Delete Server
              <Trash2 className="ml-auto size-4" />
            </DropdownMenuItem>
          </>
        )}

        {!isAdmin && (
          <>
            <DropdownMenuItem className="px-3 py-2 text-rose-500 text-sm cursor-pointer">
              Leave Server
              <ExitIcon className="ml-auto size-4" />
            </DropdownMenuItem>
          </>
        )}
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default ServerHeader;
