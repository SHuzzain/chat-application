"use client";

import ActionTooltip from "@/components/ui/action-tooltip";
import { Button } from "@/components/ui/button";
import { MicIcon, MicOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const ChatAudioButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isAudio = searchParams?.get("audio");

  const Icon = isAudio ? MicOff : MicIcon;

  const tooltipLabel = isAudio ? "End Audio call" : "Start Audio call";

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          audio: isAudio ? undefined : true,
        },
      },
      { skipNull: true }
    );

    router.replace(url);
  };
  return (
    <ActionTooltip
      tooltip={{ content: { side: "bottom" } }}
      label={tooltipLabel}
    >
      <Button
        onClick={onClick}
        className="hover:opacity-75 mr-4 transition"
        size={"icon"}
        variant={"ghost"}
      >
        <Icon className="text-zinc-500 dark:text-zinc-400 size-6" />
      </Button>
    </ActionTooltip>
  );
};
