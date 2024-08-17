"use client";
import React, { useEffect, useState } from "react";
import ServerModal from "../modals/modal-server";

type Props = {};

function ServerModalProvider({}: Props) {
  const [isMounted, setIsMounted] = useState(false);
  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) return null;
  return <ServerModal />;
}

export default ServerModalProvider;
