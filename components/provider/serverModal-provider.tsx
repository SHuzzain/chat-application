"use client";
import React, { useEffect, useState } from "react";

import ServerModal from "@/components/modals/modal-server";
import InviteModal from "@/components/modals/modal-invite";

type Props = {};

function ServerModalProvider({}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <ServerModal />
      <InviteModal />
    </>
  );
}

export default ServerModalProvider;
