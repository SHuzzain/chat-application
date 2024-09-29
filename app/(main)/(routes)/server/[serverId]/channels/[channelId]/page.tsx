import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import { currentProfile } from "@/lib/current-profile";

import prismadb from "@/lib/prismadb";
import { ChannelType } from "@prisma/client";
import MedioRoom from "@/components/chat/video-audio-chat/media-room";

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
      {channel.type === ChannelType.TEXT && (
        <>
          <ChatMessages
            member={member}
            apiUrl="/api/messages"
            chatId={channel.id}
            name={channel.name}
            type="channel"
            paramKey="channelId"
            paramValue={channel.id}
            socketQuery={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
            socketUrl="/api/socket/messages"
          />

          <ChatInput
            apiUrl="/api/socket/messages"
            name={channel.name}
            type="channel"
            query={{
              channelId: channel.id,
              serverId: channel.serverId,
            }}
          />
        </>
      )}
      {channel.type === ChannelType.VOICE && (
        <MedioRoom
          audio={true}
          video={false}
          chatId={channel.id}
          type="audio"
        />
      )}
      {channel.type === ChannelType.VIDEO && (
        <MedioRoom audio={true} video={true} chatId={channel.id} type="video" />
      )}
    </div>
  );
};

export default ChannelIdPage;
