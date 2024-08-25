"use client";

import React, { useEffect, useState } from "react";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
  TooltipProvider,
} from "./tooltip";
import {
  TooltipContentProps,
  TooltipProps,
  TooltipProviderProps,
  TooltipTriggerProps,
} from "@radix-ui/react-tooltip";

type Props = {
  label: string | React.ReactNode;
  children: string | React.ReactNode;
  tooltip?: {
    content?: TooltipContentProps;
    provider?: TooltipProviderProps;
    tip?: TooltipProps;
    trigger?: TooltipTriggerProps;
  };
};

const ActionTooltip = ({ label, children, tooltip }: Props) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <TooltipProvider {...tooltip?.provider}>
      <Tooltip {...tooltip?.tip}>
        <TooltipTrigger {...tooltip?.trigger}>{children}</TooltipTrigger>
        <TooltipContent {...tooltip?.content}>{label}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
};

export default ActionTooltip;
