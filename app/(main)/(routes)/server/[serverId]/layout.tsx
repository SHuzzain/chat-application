import ServerSideBar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  children: React.ReactNode;
  params: {
    serverId: string;
  };
};

const ServerIdLayout = async ({ children, params }: Props) => {
  const profile = await currentProfile();
  if (!profile) return auth().redirectToSignIn();

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
      Member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (!server) redirect("/");

  return (
    <div className="h-full">
      <div className="z-20 fixed inset-y-0 md:flex flex-col hidden w-60 h-full">
        <ServerSideBar serverId={params.serverId} />
      </div>
      <main className="md:pl-60 h-full">{children}</main>
    </div>
  );
};

export default ServerIdLayout;
