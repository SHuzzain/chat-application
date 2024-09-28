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
    const { serverId, channelId, messageId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!serverId) return res.status(400).json({ error: "Server ID Missing" });

    if (!channelId)
      return res.status(400).json({ error: "Channel ID Missing" });

    if (!messageId)
      return res.status(400).json({ error: "Message ID Missing" });

    const server = await prismadb.server.findFirst({
      where: {
        id: serverId as string,
        Member: {
          some: {
            profileId: profile.id,
          },
        },
      },
      include: {
        Member: true,
      },
    });
    if (!server) return res.status(401).json({ error: "Server Not Found" });

    const channel = await prismadb.channel.findFirst({
      where: {
        id: channelId as string,
        serverId: serverId as string,
      },
    });
    if (!channel) return res.status(401).json({ error: "Channel Not Found" });

    const member = server.Member.find(
      (member) => member.profileId === profile.id
    );
    if (!member) return res.status(401).json({ error: "Member Not Found" });

    let message = await prismadb.message.findFirst({
      where: {
        id: messageId as string,
        channelId: channelId as string,
      },
      include: {
        member: {
          include: {
            profile: true,
          },
        },
      },
    });

    if (!message || message.deleted) {
      return res.status(404).json({ error: "Message not found" });
    }

    const isMessageOwner = message.memberId === member.id;
    const isAdmin = member.role === MemberRole.ADMIN;
    const isModerator = member.role === MemberRole.MODERATOR;
    const canModify = isMessageOwner || isAdmin || isModerator;

    if (!canModify) return res.status(401).json({ error: "Unauthorized" });

    if (req.method === "DELETE") {
      message = await prismadb.message.update({
        where: {
          id: messageId as string,
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

      message = await prismadb.message.update({
        where: {
          id: messageId as string,
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
    const updatedKey = `chat:${channelId}:messages:updated`;

    res?.socket?.server?.io?.emit(updatedKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGESID_PATCH_DELETE]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
