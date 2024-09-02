"use client";

import { useModal } from "@/store/server-slice";
import { useEffect } from "react";

export default function SetUpPage() {
  const { onOpen, isOpen } = useModal();
  useEffect(() => {
    if (!isOpen) {
      onOpen("createServer");
    }
  }, [onOpen, isOpen]);
  return null;
}
