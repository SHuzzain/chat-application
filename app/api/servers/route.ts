import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { serverSchema } from "@/lib/zod-schema/schema";
import { MemberRole } from "@prisma/client";
import { randomUUID } from "crypto";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const profile = await currentProfile();
    const body = await req.json();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });
    const { success, error, data } = serverSchema.safeParse(body);
    if (!success) {
      return new NextResponse(error.message, { status: 400 });
    }

    const { imageUrl, name } = data;

    const server = await prismadb.server.create({
      data: {
        name,
        imageUrl,
        inviteCode: randomUUID(),
        profileId: profile.id,
        Channel: {
          create: [{ name: "general", profileId: profile.id }],
        },
        Member: {
          create: [
            {
              profileId: profile.id,
              role: MemberRole.ADMIN,
            },
          ],
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_POST]", error);
  }
}
