"use client";
import React, { useEffect, useState } from "react";

import ServerModal from "@/components/modals/modal-server";
import InviteModal from "@/components/modals/modal-invite";
import ToastProvider from "./toast-provider";
import MemberModal from "../modals/modal-member";

type Props = {};

function WrapModalProvider({}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return (
    <>
      <>
        {/* modal */}
        <ServerModal />
        <InviteModal />
        <MemberModal />
      </>
      {/* toast message */}
      <ToastProvider />
    </>
  );
}

export default WrapModalProvider;
