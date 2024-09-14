import ChatHeader from "@/components/chat/chat-header";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    serverId: string;
    channelId: string;
  };
};

const ChannelIdPage = async ({ params: { channelId, serverId } }: Props) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const channel = await prismadb.channel.findUnique({
    where: {
      id: channelId,
    },
  });

  const member = await prismadb.member.findFirst({
    where: {
      serverId,
      profileId: profile.id,
    },
  });

  if (!channel || !member) return redirect("/");

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338] h-full">
      <ChatHeader
        name={channel.name}
        serverId={channel.serverId}
        type="channels"
      />
    </div>
  );
};

export default ChannelIdPage;
