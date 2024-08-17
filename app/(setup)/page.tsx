import ServerModal from "@/components/modals/modal-server";
import ServerModalProvider from "@/components/provider/serverModal-provider";
import { initialProfile } from "@/lib/init-datebase/profile";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import React from "react";

type Props = {};

const SetupPage = async (props: Props) => {
  const profile = await initialProfile();
  const server = await prismadb.server.findFirst({
    where: {
      Member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`/server/${server.id}`);
  }
  return <ServerModalProvider />;
};

export default SetupPage;
