"use client";

import { Search } from "lucide-react";
import React, { useEffect, useState } from "react";
import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { useParams, useRouter } from "next/navigation";

type Props = {
  items: {
    label: string;
    type: "channel" | "memeber";
    data:
      | {
          icon: React.ReactNode;
          name: string;
          id: string;
        }[]
      | undefined;
  }[];
};

const ServerSearch = ({ items }: Props) => {
  const [open, setOpen] = useState(false);

  const router = useRouter();
  const params = useParams();

  useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "q" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setOpen((open) => !open);
      }
    };
    document.addEventListener("keydown", down);
    return () => document.removeEventListener("keydown", down);
  }, []);

  const onClick = ({
    id,
    type,
  }: {
    id: string;
    type: Props["items"]["0"]["type"];
  }) => {
    setOpen(false);
    switch (type) {
      case "channel":
        router.push(`/servers/${params?.serverId}/conversations/${id}`);
        break;
      case "memeber":
        router.push(`/servers/${params?.serverId}/channels/${id}`);
        break;
      default:
        break;
    }
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex gap-x-2 hover:bg-zinc-700/10 dark:hover:bg-zinc-700/50 item-center px-2 py-2 rounded-md w-full transition group"
      >
        <Search className="text-zinc-500 dark:text-zinc-400 size-4" />
        <p className="group-hover:text-zinc-600 dark:group-hover:text-zinc-300 font-semibold text-sm text-zinc-500 dark:text-zinc-400">
          Search
        </p>
        <kbd className="inline-flex items-center gap-2 bg-muted ml-auto px-2 border rounded h-5 font-medium font-mono text-[10px] text-muted-foreground pointer-events-none select-none">
          <span className="translate-y-[2px]">⌘</span>Q
        </kbd>
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Search channels" />
        <CommandList>
          <CommandEmpty>No results found.</CommandEmpty>
          {items.map(({ data, label, type }) => {
            if (!data?.length) return null;

            return (
              <CommandGroup key={label} heading={label}>
                {data?.map(({ icon, id, name }) => (
                  <CommandItem onClick={() => onClick({ id, type })} key={id}>
                    {icon} <span>{name}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            );
          })}
        </CommandList>
      </CommandDialog>
    </>
  );
};

export default ServerSearch;
