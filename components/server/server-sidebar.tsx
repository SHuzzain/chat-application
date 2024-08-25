import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { Channel, ChannelType } from "@prisma/client";
import { redirect } from "next/navigation";
import React from "react";
import ServerHeader from "./server-header";

type Props = {
  serverId: string;
};

const ServerSideBar = async ({ serverId }: Props) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const server = await prismadb.server.findUnique({
    where: {
      id: serverId,
    },
    include: {
      Channel: {
        orderBy: {
          createdAt: "asc",
        },
      },
      Member: {
        include: {
          profile: true,
        },
        orderBy: {
          createdAt: "asc",
        },
      },
    },
  });

  const categorizedChannels: Record<string, Channel[]> = {
    textChannels: [],
    audioChannels: [],
    videoChannels: [],
  };

  server?.Channel.forEach((channel) => {
    switch (channel.type) {
      case ChannelType.TEXT:
        categorizedChannels.textChannels.push(channel);
        break;
      case ChannelType.VOICE:
        categorizedChannels.audioChannels.push(channel);
        break;
      case ChannelType.VIDEO:
        categorizedChannels.videoChannels.push(channel);
        break;
      default:
        break;
    }
  });

  const textChannels = categorizedChannels.textChannels;
  const audioChannels = categorizedChannels.audioChannels;
  const videoChannels = categorizedChannels.videoChannels;

  const members = server?.Member.filter(
    (member) => member.profileId !== profile.id
  );

  if (!server) return redirect("/");

  const role = server.Member.find(
    (member) => member.profileId === profile.id
  )?.role;

  return (
    <div className="flex flex-col bg-sidebar text-primary size-full">
      <ServerHeader server={server} role={role} />
    </div>
  );
};

export default ServerSideBar;
