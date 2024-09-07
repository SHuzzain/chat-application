import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { NextRequest, NextResponse } from "next/server";

export async function PATCH(
  req: NextRequest,
  { params }: { params: { serverId: string } }
) {
  try {
    const profile = await currentProfile();

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!params.serverId)
      return new NextResponse("Server ID Missing", { status: 400 });

    const server = await prismadb.server.update({
      where: {
        id: params.serverId,
        profileId: {
          not: profile.id,
        },
        Member: {
          some: {
            profileId: profile.id,
          },
        },
      },

      data: {
        Member: {
          deleteMany: {
            profileId: profile.id,
          },
        },
      },
    });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[SERVER_ID_LEAVE_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}
