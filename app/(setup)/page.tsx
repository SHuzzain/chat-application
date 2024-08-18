"use client";

import { useServerModal } from "@/store/server-slice";
import { useEffect } from "react";

export default function SetUpPage() {
  const { onOpen, isOpen } = useServerModal();
  useEffect(() => {
    if (!isOpen) {
      onOpen();
    }
  }, [onOpen, isOpen]);
  return null;
}
