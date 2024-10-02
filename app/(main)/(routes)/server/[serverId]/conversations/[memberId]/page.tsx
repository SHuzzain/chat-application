import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
import MedioRoom from "@/components/chat/video-audio-chat/media-room";
import { getOrCreateConversation } from "@/lib/conversation";
import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import React from "react";

type Props = {
  params: {
    serverId: string;
    memberId: string;
  };
  searchParams: {
    video?: boolean;
    audio?: boolean;
  };
};

const MemberIdPage = async ({ params, searchParams }: Props) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const currentMember = await prismadb.member.findFirst({
    where: {
      profileId: profile.id,
      serverId: params?.serverId,
    },
    include: {
      profile: true,
    },
  });

  if (!currentMember) return redirect(`/`);

  const conversation = await getOrCreateConversation(
    currentMember.id,
    params?.memberId
  );
  if (!conversation) return redirect(`/server/${params.serverId}`);

  const { memberOne, memberTwo } = conversation;

  const otherMember =
    memberOne.profileId === profile.id ? memberTwo : memberOne;

  return (
    <div className="flex flex-col bg-white dark:bg-[#313338] h-full">
      <ChatHeader
        imageUrl={otherMember.profile.imageUrl}
        name={otherMember.profile.name}
        serverId={params.serverId}
        type="conversation"
        searchParams={searchParams}
      />
      {searchParams?.video ? (
        <MedioRoom
          chatId={conversation.id}
          audio={true}
          video={true}
          type="video"
        />
      ) : searchParams?.audio ? (
        <MedioRoom
          chatId={conversation.id}
          audio={true}
          video={false}
          type="audio"
        />
      ) : (
        <>
          <ChatMessages
            member={currentMember}
            apiUrl="/api/direct-messages"
            chatId={conversation.id}
            name={otherMember.profile.name}
            type="conversation"
            paramKey="conversationId"
            paramValue={conversation.id}
            socketUrl="/api/socket/direct-messages"
            socketQuery={{
              conversationId: conversation.id,
            }}
          />

          <ChatInput
            apiUrl="/api/socket/direct-messages"
            name={otherMember.profile.name}
            type="conversation"
            query={{
              conversationId: conversation.id,
            }}
          />
        </>
      )}
    </div>
  );
};

export default MemberIdPage;
