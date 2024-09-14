"use client";
import React from "react";
import { useSocket } from "@/components/provider/socket-provider";
import { Badge } from "@/components/ui/badge";

const SocketIndicator = () => {
  const { isConnected } = useSocket();

  if (!isConnected)
    return (
      <Badge
        variant={"outline"}
        className="bg-yellow-600 border-none text-white"
      >
        Fallback: Pollings every 1s
      </Badge>
    );
  return (
    <Badge
      variant={"outline"}
      className="bg-emerald-600 border-none text-white"
    >
      Live: Real-time update
    </Badge>
  );
};

export default SocketIndicator;
