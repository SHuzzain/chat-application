"use client";
import React, { useState } from "react";

import axios from "axios";

import { useModal } from "@/store/server-slice";
import useOrigin from "@/hook/use-origin";

import OnCopyButton from "../common/on-copy";
import { Modal } from "@/components/ui/modal";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";

import { RefreshCcw } from "lucide-react";
import toast from "react-hot-toast";
import { cn } from "@/lib/utils";

function InviteModal() {
  const { isOpen, onClose, onOpen, data, type } = useModal();
  const origin = useOrigin();

  const server = data?.server;

  const ModalIsOpen = isOpen && type == "invite";

  const [loading, setLoading] = useState(false);

  const inviteUrl = `${origin}/invite/${server?.inviteCode}`;

  const onNewLink = async () => {
    try {
      setLoading(true);
      const response = await axios.patch(
        `/api/servers/${server?.id}/invite-code`
      );
      onOpen("invite", { server: response.data });
    } catch (error) {
      console.log(error);
      toast.error("Failed to generate link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal
      componentStyle={{
        content: {
          className: "bg-slate-100 text-black px-0 overflow-hidden",
        },
        header: {
          className: "pt-8 px-6",
        },
        title: {
          className: "text-2xl text-center font-bold",
        },
        description: {
          className: "text-center font-bold text-zinc-500",
        },
      }}
      title="Invite Friends"
      description=""
      isOpen={ModalIsOpen}
      onClose={onClose}
    >
      <div className="p-6">
        <Label
          className={`font-bold text-xs text-zinc-500 dark:text-secondary/70 uppercase`}
        >
          Server invite link
        </Label>

        <div className="flex items-center mt-2">
          <Input
            value={inviteUrl}
            disabled={loading}
            className="border-0 bg-zinc-300/50 rounded-tr-none rounded-br-none focus-visible:ring-0 focus-visible:ring-offset-0 text-black"
          />
          <OnCopyButton
            isDisabled={loading}
            className="bg-zinc-300/40 rounded-tl-none rounded-bl-none"
            copyUrl={inviteUrl}
          />
        </div>

        <Button
          variant={"link"}
          size={"sm"}
          onClick={onNewLink}
          disabled={loading}
          className="mt-4 text-xs text-zinc-500"
        >
          Generate a new link
          <RefreshCcw
            className={cn("ml-2 size-4", loading && "animate-spin")}
          />
        </Button>
      </div>
    </Modal>
  );
}

export default InviteModal;
