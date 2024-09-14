"use client";
import React from "react";
import { useSocket } from "@/components/provider/socket-provider";
import { Badge } from "@/components/ui/badge";
import { Clock, Radio } from "lucide-react";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected)
    return (
      <>
        <Badge
          variant={"outline"}
          className="bg-yellow-600 border-none text-white max-md:size-8"
        >
          <span className="max-md:hidden">Fallback: Pollings Every 1s</span>
          <Clock className="md:hidden size-4" />
        </Badge>
      </>
    );
  return (
    <>
      <Badge
        variant={"outline"}
        className="bg-emerald-600 border-none text-white max-md:size-8"
      >
        <span className="max-md:hidden">Live: Real-Time Update</span>
        <Radio className="md:hidden size-4" />
      </Badge>
    </>
  );
};

export default SocketIndicator;
