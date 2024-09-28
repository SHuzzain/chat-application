"use client";
import { ServerWithMemberProfile } from "@/types";
import { MemberRole, Server } from "@prisma/client";
import React, { useState } from "react";
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
import { ModalData, useModal } from "@/store/server-slice";
import ConfirmModal from "../modals/modal-confirm";
import axios from "axios";

type Props = {
  server: ServerWithMemberProfile;
  role?: MemberRole;
};

const ServerHeader = ({ server, role }: Props) => {
  const { onOpen, data } = useModal();

  const [confirm, setConfirm] = useState<
    ModalData & { isOpen: boolean; type?: "leave" | "deleteServer" }
  >({
    isOpen: false,
  });

  const isAdmin = role === MemberRole.ADMIN;
  const isModerator = isAdmin || role === MemberRole.MODERATOR;

  const confirmInfo = {
    title: confirm.type === "leave" ? "Leave" : "Leave Server",
    description:
      confirm.type === "leave" ? (
        <>
          are you sure you want to leave{" "}
          <span className="font-semibold text-indigo-500">
            {confirm.server?.name}
          </span>
          {"   "}?
        </>
      ) : (
        <>
          are you sure you want do this{" ?"}{" "}
          <span className="font-semibold text-indigo-500">
            {confirm.server?.name}
          </span>{" "}
          will be permanently deleted
        </>
      ),
    axiosFunction: () =>
      confirm.type === "leave"
        ? axios.patch(`/api/servers/${confirm.server?.id}/leave`)
        : axios.delete(`/api/servers/${confirm.server?.id}`),
  };

  return (
    <>
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
              <DropdownMenuItem
                onClick={() => onOpen("createChannel")}
                className="px-3 py-2 cursor-pointer"
              >
                Create Channel
                <PlusCircle className="ml-auto size-4" />
              </DropdownMenuItem>

              <DropdownMenuSeparator />
            </>
          )}

          {isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  setConfirm({ isOpen: true, server, type: "deleteServer" })
                }
                className="px-3 py-2 text-rose-500 text-sm cursor-pointer"
              >
                Delete Server
                <Trash2 className="ml-auto size-4" />
              </DropdownMenuItem>
            </>
          )}

          {!isAdmin && (
            <>
              <DropdownMenuItem
                onClick={() =>
                  setConfirm({ isOpen: true, server, type: "leave" })
                }
                className="px-3 py-2 text-rose-500 text-sm cursor-pointer"
              >
                Leave Server
                <ExitIcon className="ml-auto size-4" />
              </DropdownMenuItem>
            </>
          )}
        </DropdownMenuContent>
      </DropdownMenu>

      {/* confirm modal */}
      <ConfirmModal
        {...confirmInfo}
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ isOpen: false })}
        redirectPath="/"
      />
    </>
  );
};

export default ServerHeader;
