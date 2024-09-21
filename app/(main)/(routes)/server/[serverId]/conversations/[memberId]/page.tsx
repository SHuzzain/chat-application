import ChatHeader from "@/components/chat/chat-header";
import ChatInput from "@/components/chat/chat-input";
import ChatMessages from "@/components/chat/chat-messages";
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
};

const MemberIdPage = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  const currentMember = await prismadb.member.findFirst({
    where: {
      id: params?.memberId,
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
      />

      {/* <ChatMessages member={otherMember} apiUrl="/api/messages" chatId={conversation.} /> */}

      <ChatInput
        apiUrl="/api/socket/conversation"
        name={otherMember.profile.name}
        type="conversation"
        query={{
          channelId: otherMember.id,
          serverId: otherMember.serverId,
        }}
      />
    </div>
  );
};

export default MemberIdPage;
