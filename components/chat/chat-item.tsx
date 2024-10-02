"use client";
import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";

import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import axios from "axios";
import qs from "query-string";
import { Member, MemberRole, Profile } from "prisma/prisma-client";
import { roleIconMap } from "@/helper";

import UserAvatar from "@/components/common/user-avatar";
import ActionTooltip from "@/components/ui/action-tooltip";
import { Form, FormItem, FormControl, FormField } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import ConfirmModal, {
  ConfirmModalProps,
} from "@/components/modals/modal-confirm";

import { Edit, FileIcon, TrashIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatSchema } from "@/lib/zod-schema/schema";
import toast from "react-hot-toast";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRouter } from "next/navigation";

type Props = {
  id: string;
  content: string;
  member: Member & {
    profile: Profile;
  };
  timestamp: string;
  fileUrl: string | null;
  deleted: boolean;
  currentMember: Member;
  isUpdated: boolean;
  socketUrl: string;
  socketQuery: Record<string, string>;
};

const ChatItem = (props: Props) => {
  const {
    content,
    currentMember,
    deleted,
    fileUrl,
    id,
    isUpdated,
    member,
    socketQuery,
    socketUrl,
    timestamp,
  } = props;

  const [confirm, setConfirm] = useState<{ isOpen: boolean }>({
    isOpen: false,
  });

  const params = useParams();
  const router = useRouter();

  const form = useForm<z.infer<typeof chatSchema>>({
    resolver: zodResolver(chatSchema),
    defaultValues: {
      content: "",
    },
  });

  const isLoading = form.formState.isSubmitting;

  const [isEditing, setIsEditing] = useState(false);

  const fileType = fileUrl?.split(".").pop();

  const isAdmin = currentMember.role === MemberRole.ADMIN;
  const isModerator = currentMember.role === MemberRole.MODERATOR;
  const isOwner = currentMember.id === member.id;
  const canDeleteMessage = !deleted && (isAdmin || isModerator || isOwner);
  const canEditMessage = !deleted && isOwner && !fileUrl;
  const isPDF = fileType === "pdf" && fileUrl;
  const isImage = !isPDF && fileUrl;

  async function onSubmit(values: z.infer<typeof chatSchema>) {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.patch(url, values);
    } catch (error) {
      toast.error("Filed to update message");
      console.log("[FD_PATCH_MESSAGE]", error);
    } finally {
      form.reset();
      setIsEditing(false);
    }
  }

  async function handleDelete() {
    try {
      const url = qs.stringifyUrl({
        url: `${socketUrl}/${id}`,
        query: socketQuery,
      });
      await axios.delete(url);
    } catch (error) {
      toast.error("Failed to delete message");
    } finally {
      form.reset();
      setConfirm({ isOpen: false });
    }
  }

  function reDirectMember() {
    if (member.id == currentMember.id) return null;
    router.push(`/server/${params?.serverId}/conversations/${member.id}`);
  }

  const confirmInfo = useMemo(
    () => ({
      title: "Delete Message",
      description: (
        <>
          Are you sure you want to do this? <br /> The message will be
          permanently delete.
        </>
      ),
      axiosFunction: handleDelete,
    }),
    []
  );

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if ((e.key === "Escape" || e.keyCode === 27) && isEditing) {
        e.preventDefault();
        setIsEditing(false);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, [isEditing]);

  useEffect(() => {
    form.reset({
      content,
    });
  }, [content, form]);

  return (
    <>
      <div className="relative flex items-center hover:bg-black/5 p-4 w-full transition group">
        <div className="flex items-start gap-2 w-full group">
          <section className="hover:drop-shadow-md transition cursor-pointer">
            <UserAvatar src={member.profile.imageUrl} />
          </section>

          <section className="flex flex-col w-full">
            <div className="flex items-center gap-x-2">
              <div className="flex items-center gap-2">
                <p
                  onClick={reDirectMember}
                  className="font-semibold text-sm hover:underline cursor-pointer"
                >
                  {member.profile.name}
                </p>
                <ActionTooltip label={member.role}>
                  {roleIconMap[member.role]}
                </ActionTooltip>
              </div>
              <time dateTime={timestamp}>
                <small className="text-zinc-500 dark:text-zinc-400">
                  {timestamp}
                </small>
              </time>
            </div>
            {isImage && (
              <a
                href={fileUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="relative flex items-center bg-secondary mt-2 border rounded-md overflow-hidden aspect-square j size-48"
              >
                <Image fill src={isImage} alt={content} objectFit="cover" />
              </a>
            )}

            {isPDF && (
              <div
                className={`relative flex items-center p-5 mt-2 rounded-md bg-background/10 overflow-hidden`}
              >
                <a
                  href={isPDF}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2"
                  title={fileUrl}
                >
                  <span className="top-0 left-0 absolute drop-shadow-xl text-indigo-500 dark:text-indigo-400 hover:underline -rotate-45">
                    {fileType}
                  </span>
                  <FileIcon className="fill-indigo-200 size-10 stroke-indigo-400" />
                  <small className="line-clamp-1 text-zinc-500 dark:text-zinc-400">
                    {fileUrl}
                  </small>
                </a>
              </div>
            )}
            {!fileUrl && !isEditing && (
              <p
                className={cn(
                  "text-sm text-zinc-600 dark:text-zinc-300",
                  deleted &&
                    "italic  text-zinc-500 dark:text-zinc-400 text-xs mt-1"
                )}
              >
                {content}
                {isUpdated && !deleted && (
                  <small className="mx-2 text-zinc-500 dark:text-zinc-400">
                    (edited)
                  </small>
                )}
              </p>
            )}
            {!fileUrl && isEditing && (
              <Form {...form}>
                <form
                  className="flex items-center gap-x-2 py-2 pr-2 w-full"
                  onSubmit={form.handleSubmit(onSubmit)}
                >
                  <FormField
                    control={form.control}
                    name="content"
                    disabled={isLoading}
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <div className="relative w-full">
                            <Input
                              placeholder="Edited message"
                              className="bg-zinc-200/90 dark:bg-zinc-700/75 py-2 border-none text-zinc-600 dark:text-zinc-200"
                              {...field}
                            />
                          </div>
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <Button disabled={isLoading} size={"sm"} variant={"primary"}>
                    Save
                  </Button>
                </form>
                <small className="mt-1 text-zinc-400">
                  Press escape to cancel, enter to save
                </small>
              </Form>
            )}
          </section>
        </div>
        {canDeleteMessage && (
          <div className="group-hover:flex -top-2 right-5 absolute items-center hidden bg-white dark:bg-zinc-800 border rounded-sm">
            {canEditMessage && (
              <ActionTooltip label={"Edit"}>
                <section
                  onClick={() => setIsEditing(!isEditing)}
                  className="hover:bg-[#e6e7e9] dark:hover:bg-zinc-700 p-2 hover:rounded text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
                >
                  <Edit className="ml-auto cursor-pointer size-4" />
                </section>
              </ActionTooltip>
            )}

            <ActionTooltip label={"Delete"}>
              <section
                onClick={() => setConfirm({ isOpen: true })}
                className="hover:bg-[#e6e7e9] dark:hover:bg-zinc-700 p-2 hover:rounded text-zinc-500 hover:text-zinc-600 dark:hover:text-zinc-300 transition"
              >
                <TrashIcon className="ml-auto cursor-pointer size-4" />
              </section>
            </ActionTooltip>
          </div>
        )}
      </div>

      {/* confirm modal */}
      <ConfirmModal
        {...confirmInfo}
        isOpen={confirm.isOpen}
        onClose={() => setConfirm({ isOpen: false })}
      />
    </>
  );
};

export default ChatItem;
