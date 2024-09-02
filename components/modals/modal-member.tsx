"use client";
import React, { useState } from "react";

import { useModal } from "@/store/server-slice";

import { Modal } from "@/components/ui/modal";
import { ServerWithMemberProfile } from "@/types";
import { ScrollArea } from "../ui/scroll-area";
import UserAvatar from "../common/user-avatar";
import {
  Check,
  DoorOpenIcon,
  Loader2,
  MoreVerticalIcon,
  Shield,
  ShieldAlert,
  ShieldCheck,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import toast from "react-hot-toast";

import { MemberRole } from "@prisma/client";
import qs from "query-string";
import axios from "axios";
import { useRouter } from "next/navigation";

const roleIconMap = {
  GUEST: null,
  MODERATOR: <ShieldCheck className="ml-2 text-indigo-500 size-4" />,
  ADMIN: <ShieldAlert className="ml-2 text-rose-500 size-4" />,
};

function MemberModal() {
  const route = useRouter();
  const [loadingId, setLoadingId] = useState("");

  const { isOpen, onClose, data, type, onOpen } = useModal();

  const server = data?.server as ServerWithMemberProfile;

  const ModalIsOpen = isOpen && type == "member";

  const onRoleChange = async (memberId: string, role: MemberRole) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });

      const response = await axios.patch(url, { role });
      route.refresh();
      onOpen("member", { server: response.data });
    } catch (error) {
      toast.error("Failed to change role");
    } finally {
      setLoadingId("");
    }
  };

  const onKickOut = async (memberId: string) => {
    try {
      setLoadingId(memberId);
      const url = qs.stringifyUrl({
        url: `/api/members/${memberId}`,
        query: {
          serverId: server.id,
        },
      });

      const response = await axios.delete(url);
      route.refresh();
      onOpen("member", { server: response.data });
    } catch (error) {
      toast.error("Failed to kict out");
    } finally {
      setLoadingId("");
    }
  };
  return (
    <Modal
      componentStyle={{
        content: {
          className: "bg-slate-100 text-black  overflow-hidden",
        },
        header: {
          className: "pt-8 px-6",
        },
        title: {
          className: "text-2xl text-center font-bold",
        },
        description: {
          className: "text-center text-zinc-500",
        },
      }}
      title="Mange Member"
      description={`${server?.Member?.length} Members`}
      isOpen={ModalIsOpen}
      onClose={onClose}
    >
      <ScrollArea className="mt-8 pr-6 max-h-[420px]">
        {Array.isArray(server?.Member) &&
          server.Member.map((member) => (
            <div className="flex items-center gap-x-2 mb-6" key={member.id}>
              <UserAvatar src={member.profile.imageUrl} />
              <div className="flex flex-col gap-y-1">
                <div className="flex items-center font-semibold text-xs">
                  {member.profile.name}
                  {roleIconMap[member.role]}
                </div>
                <p className="text-xs text-zinc-500">{member.profile.email}</p>
              </div>
              {server.profileId !== member.profileId &&
                loadingId !== member.profileId && (
                  <div className="ml-auto">
                    <DropdownMenu>
                      <DropdownMenuTrigger>
                        <MoreVerticalIcon className="text-zinc-500 size-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent side="left">
                        <DropdownMenuSub>
                          <DropdownMenuSubTrigger className="flex items-center cursor-pointer">
                            <ShieldAlert className="mr-2 size-4" />
                            <span>Role</span>
                          </DropdownMenuSubTrigger>
                          <DropdownMenuPortal>
                            <DropdownMenuSubContent className="[&>div]:cursor-pointer">
                              <DropdownMenuItem
                                onClick={() => onRoleChange(member.id, "GUEST")}
                              >
                                <Shield className="mr-2 size-4" />
                                Guest
                                {member.role === "GUEST" && (
                                  <Check className="ml-2 size-4" />
                                )}
                              </DropdownMenuItem>

                              <DropdownMenuItem
                                onClick={() =>
                                  onRoleChange(member.id, "MODERATOR")
                                }
                              >
                                <Shield className="mr-2 size-4" />
                                Moderator
                                {member.role === "MODERATOR" && (
                                  <Check className="ml-2 size-4" />
                                )}
                              </DropdownMenuItem>
                            </DropdownMenuSubContent>
                          </DropdownMenuPortal>
                        </DropdownMenuSub>
                        <DropdownMenuSeparator />

                        <DropdownMenuItem
                          className="flex items-center"
                          onClick={() => onKickOut(member.id)}
                        >
                          <DoorOpenIcon className="mr-2 text-rose-500 size-4" />
                          Kick Out
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                )}
              {loadingId === member.profileId && (
                <Loader2 className="ml-auto text-zinc-500 animate-spin size-4" />
              )}
            </div>
          ))}
      </ScrollArea>
    </Modal>
  );
}

export default MemberModal;
