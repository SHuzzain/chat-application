"use client";
import React, { useEffect, useState } from "react";

import ServerModal from "@/components/modals/modal-server";
import InviteModal from "@/components/modals/modal-invite";
import ToastProvider from "@/components/provider/toast-provider";
import MemberModal from "@/components/modals/modal-member";
import ChannelModal from "@/components/modals/modal-channel";
import ChatFileUploadModal from "@/components/modals/modal-upload";

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
        <ChannelModal />
        <ChatFileUploadModal />
      </>
      {/* toast message */}
      <ToastProvider />
    </>
  );
}

export default WrapModalProvider;
