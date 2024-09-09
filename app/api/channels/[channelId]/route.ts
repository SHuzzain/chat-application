import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { channelSchema } from "@/lib/zod-schema/schema";
import { MemberRole } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";





export async function PATCH(
  req: NextRequest,
  { params }: { params: { channelId: string } }
) {
  try {
    const profile = await currentProfile();
    const body = await req.json()
    const { searchParams } = req.nextUrl;
    const serverId = searchParams.get("serverId");

    if (!profile) return new NextResponse("Unauthorized", { status: 401 });

    if (!serverId)
      return new NextResponse("Server ID Missing", { status: 400 })

    const { success, error, data } = channelSchema.safeParse(body);

    if (!success) {
      return new NextResponse(error.message, { status: 400 });
    }

    const { type, name } = data;


    const server = await prismadb.server.update({
      where: {
         id: serverId, 
         Member: {some: {profileId: profile.id, role: {
         in: [MemberRole.ADMIN, MemberRole.MODERATOR]
      }}}}, 
      data: {
         Channel: {
            update: {
              where: {
                id: params.channelId,
              },
              data: {
                name,
                type
              }
            }
         }
      }
     });

    return NextResponse.json(server);
  } catch (error) {
    console.log("[MEMBER_ID_PATCH]", error);
    return new NextResponse("Internal Error", { status: 500 });
  }
}


export async function DELETE(
    req: NextRequest,
    { params }: { params: { channelId: string } }
  ) {
    try {
      const profile = await currentProfile();
  
      const { searchParams } = req.nextUrl;
      const serverId = searchParams.get("serverId");
  
      if (!profile) return new NextResponse("Unauthorized", { status: 401 });
  
      if (!serverId)
        return new NextResponse("Server ID Missing", { status: 400 });
  
      if (!params.channelId)
        return new NextResponse("Member ID Missing", { status: 400 });
  
      const server = await prismadb.server.update({
        where: { id: serverId, Member: {
          some: {
            profileId: profile.id,
            role: {
              in: [MemberRole.ADMIN, MemberRole.MODERATOR],
            },
          }
        } },

        data: {
          Channel: {
            delete: {
              id: params.channelId,
              name: {
                not: "general"
              }
            }
          }
        }
     
     
      });
  
      return NextResponse.json(server);
    } catch (error) {
      console.log("[CHENNAL_ID_DELETE]", error);
      return new NextResponse("Internal Error", { status: 500 });
    }
  }