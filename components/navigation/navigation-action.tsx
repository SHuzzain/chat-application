"use client";

import { Plus } from "lucide-react";
import React from "react";
import ActionTooltip from "../ui/action-tooltip";
import { useServerModal } from "@/store/server-slice";

type Props = {};

const NavigationAction = (props: Props) => {
  const { onOpen } = useServerModal();
  return (
    <div>
      <ActionTooltip
        tooltip={{
          content: {
            align: "center",
            side: "right",
          },
        }}
        label="Add a Server"
      >
        <button className="group" onClick={onOpen}>
          <div className="group-hover:bg-emerald-500 flex justify-center items-center bg-background dark:bg-neutral-700 shadow group-hover:shadow-emerald-500 mx-3 rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden dark:outline-0 outline outline-emerald-500 size-12">
            <Plus
              size={25}
              className="group-hover:text-white group-hover:rotate-90 group-hover:scale-105 text-emerald-500 transition duration-500 rotate-0 scale-100"
            />
          </div>
        </button>
      </ActionTooltip>
    </div>
  );
};

export default NavigationAction;
