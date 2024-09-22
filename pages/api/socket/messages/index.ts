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
    const { serverId, channelId } = req.query;

    if (!profile) return res.status(401).json({ error: "Unauthorized" });

    if (!success) return res.status(400).json({ error: error.message });

    if (!serverId) return res.status(400).json({ error: "Server ID Missing" });

    if (!channelId)
      return res.status(400).json({ error: "Channel ID Missing" });

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

    const { content, fileUrl } = data;

    const message = await prismadb.message.create({
      data: {
        content,
        fileUrl,
        channelId: channelId as string,
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

    const channelKey = `chat:${channelId}:messages`;

    res?.socket?.server?.io?.emit(channelKey, message);

    return res.status(200).json(message);
  } catch (error) {
    console.log("[MESSAGES_POST]", error);
    return res.status(500).json({ error: "Internal Error" });
  }
}
