import { NextApiRequest } from "next";

import { NextApiResposeServerIO } from "@/types";
import { currentPageProfile } from "@/lib/current-profile-page";
import { chatSchema } from "@/lib/zod-schema/schema";
import prismadb from "@/lib/prismadb";
import { MemberRole } from "@prisma/client";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResposeServerIO
) {
  if (!["PATCH", "DELETE"].includes(req.method ?? "")) {
    return res.status(405).json({ error: "Method not allowed" });
  }
  try {
    const profile = await currentPageProfile(req);
    const { conversationId, directMessageId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!conversationId)
      return res.status(400).json({ error: "Conversation ID Missing" });

    if (!directMessageId)
      return res.status(400).json({ error: "Direct Message ID Missing" });

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
    if (!conversation)
      return res.status(401).json({ error: "Conversation Not Found" });

    const member =
      conversation.memberOne.profileId === profile.id
        ? conversation.memberOne
        : conversation.memberTwo;
    if (!member) return res.status(401).json({ error: "Member Not Found" });

    let directMessage = await prismadb.directMessage.findFirst({
      where: {
        id: directMessageId as string,
        conversationId: conversationId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!directMessage || directMessage.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = directMessage.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) return res.status(401).json({ error: "Unauthorized" });

    if (req.method === "DELETE") {
      directMessage = await prismadb.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          fileUrl: null,
          content: "This message has been deleted.",
          deleted: true,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }

    if (req.method === "PATCH") {
      const { success, error, data } = chatSchema.safeParse(req.body);
      if (!success) return res.status(400).json({ error: error.message });
      const { content } = data;

      if (!isMessageOwner)
        return res.status(401).json({ error: "Unauthorized" });

      directMessage = await prismadb.directMessage.update({
        where: {
          id: directMessageId as string,
          conversationId: conversationId as string,
        },
        data: {
          content,
        },
        include: {
          member: {
            include: {
              profile: true,
            },
          },
        },
      });
    }
    const updatedKey = `chat:${conversationId}:messages:updated`;

    res?.socket?.server?.io?.emit(updatedKey, directMessage);

    return res.status(200).json(directMessage);
  } catch (error) {
    console.log("[DIRECT_MESSAGESID_PATCH_DELETE]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
