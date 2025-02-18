import React from "react";
import { Hash } from "lucide-react";
import { Skeleton } from "@/components/ui/skeleton";

type HeaderProps = {
  type: "channels" | "conversation";
};

export const ChatHeaderLoader = ({ type }: HeaderProps) => {
  return (
    <div className="flex items-center border-neutral-200 dark:border-neutral-800 px-3 border-b-2 h-12 font-semibold text-md">
      {type === "channels" && (
        <Hash className="mr-2 text-zinc-500 dark:text-zinc-400 size-5" />
      )}
      {type === "conversation" && (
        <Skeleton className="mr-2 rounded-full size-9" />
      )}
      {/* name */}
      <Skeleton className="w-36 h-4" />

      <div className="flex items-center ml-auto">
        <Skeleton className="w-36 h-4 max-md:size-8" />
      </div>
    </div>
  );
};

export const ChatMessageLoader = () => {
  return (
    <div className="flex flex-col flex-1 justify-end gap-8 m-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="rounded-full w-12 h-12" />
          <div className="space-y-2">
            <Skeleton className="w-[250px] h-4" />
            <Skeleton className="w-[200px] h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChatWelcomeLoader = () => {
  return (
    <div className="flex flex-col flex-1 justify-end gap-8 m-4">
      {[...Array(8)].map((_, index) => (
        <div key={index} className="flex items-center space-x-4">
          <Skeleton className="rounded-full w-12 h-12" />
          <div className="space-y-2">
            <Skeleton className="w-[250px] h-4" />
            <Skeleton className="w-[200px] h-4" />
          </div>
        </div>
      ))}
    </div>
  );
};

export const ChatInputLoader = () => {
  return (
    <div className="relative p-4 pb-6 w-full">
      <Skeleton className="w-full h-8" />
    </div>
  );
};
