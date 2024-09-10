"use client";
import React from "react";
import ActionTooltip from "../ui/action-tooltip";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { useParams, useRouter } from "next/navigation";

type Props = {
  id: string;
  name: string;
  imageUrl: string;
};

const NavigationItem = ({ id, imageUrl, name }: Props) => {
  const params = useParams();
  const router = useRouter();

  const changeServerRoute = (id: string) => {
    router.replace(`/server/${id}`);
  };
  return (
    <ActionTooltip
      label={name}
      tooltip={{
        content: {
          side: "right",
          align: "center",
        },
      }}
    >
      <button
        type="button"
        onClick={() => changeServerRoute(id)}
        className="relative flex items-center dark:bg-transparent group"
      >
        <div
          className={cn(
            "absolute left-0 bg-primary rounded-r-full transition-all w-1",
            params?.serverId !== id && "group-hover:h-5",
            params?.serverId === id ? "h-9" : "h-2"
          )}
        />
        <div
          className={cn(
            `relative    transition-all 
             overflow-hidden flex mx-3 size-12 `,
            params?.serverId === id && "bg-primary/10 text-primary rounded-xl",
            params?.serverId !== id && "group-hover:rounded-2xl"
          )}
        >
          <Image fill src={imageUrl} alt="Channel" className="object-cover" />
        </div>
      </button>
    </ActionTooltip>
  );
};

export default NavigationItem;
