import React from "react";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  params: {
    serverId: string;
  };
};

const ServerIdPage = async ({ params }: Props) => {
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
    include: {
      Channel: {
        where: {
          name: "general",
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const initialChannel = server?.Channel[0];

  if (initialChannel?.name !== "general") return null;

  return redirect(`/server/${params.serverId}/channels/${initialChannel.id}`);
};

export default ServerIdPage;
