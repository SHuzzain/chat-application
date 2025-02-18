import ServerSideBar from "@/components/server/server-sidebar";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Server } from "@prisma/client";
import { Metadata, ResolvingMetadata } from "next";
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

// meta data

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = params.serverId;
  const profile = await currentProfile();

  const previousImages = (await parent).openGraph?.images || [];

  if (!profile) {
    return {
      title: "Discord",
      openGraph: {
        images: previousImages,
      },
    };
  }

  const server = await prismadb.server.findUnique({
    where: {
      id: params.serverId,
    },
  });

  const serverName = server?.name || "";
  const title = `${serverName}`;

  return {
    title: title,
    openGraph: {
      images: [server?.imageUrl || "", ...previousImages],
    },
  };
}
