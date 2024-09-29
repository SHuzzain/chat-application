"use client";

import ActionTooltip from "@/components/ui/action-tooltip";
import { Button } from "@/components/ui/button";
import { Video, VideoOff } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";

export const ChatVideoButton = () => {
  const pathname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isVideo = searchParams?.get("video");

  const Icon = isVideo ? VideoOff : Video;

  const tooltipLabel = isVideo ? "End video call" : "Start Video call";

  const onClick = () => {
    const url = qs.stringifyUrl(
      {
        url: pathname || "",
        query: {
          video: isVideo ? undefined : true,
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
