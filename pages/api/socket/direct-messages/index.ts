import { NextApiRequest } from "next";

import { NextApiResposeServerIO } from "@/types";
import { currentPageProfile } from "@/lib/current-profile-page";
import { chatSchema } from "@/lib/zod-schema/schema";
import prismadb from "@/lib/prismadb";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResposeServerIO
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await currentPageProfile(req);
    const { success, error, data } = chatSchema.safeParse(req.body);
    const { conversationId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!success) return res.status(400).json({ error: error.message });

    if (!conversationId)
      return res.status(400).json({ error: "Conversation ID Missing" });

    const conversation = await prismadb.conversation.findFirst({
      where: {
        id: conversationId as string,
        OR: [
          {
            memberOne: {
              profileId: profile.id,
            },
          },
          {
            memberTwo: {
              profileId: profile.id,
            },
          },
        ],
      },
      include: {
        memberOne: {
          include: {
            profile: true,
          },
        },
        memberTwo: {
          include: {
            profile: true,
          },
        },
      },
    });
    console.log({ conversation });
    if (!conversation)
      return res.status(401).json({ error: "Conversation Not Found" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;

    if (!member) return res.status(401).json({ error: "Member Not Found" });

    const { content, fileUrl } = data;

    const message = await prismadb.directMessage.create({
      data: {
        content,
        fileUrl,
        conversationId: conversationId as string,
        memberId: member.id,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    const channelKey = `chat:${conversationId}:messages`;
    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error: any) {
    console.error("[DIRECT_MESSAGES_POST]", error?.stack || error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
