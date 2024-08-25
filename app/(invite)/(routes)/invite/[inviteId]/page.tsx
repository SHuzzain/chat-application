import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

type Props = {
  params: {
    inviteId: string;
  };
};

const InviteIdPage = async ({ params }: Props) => {
  const profile = await currentProfile();

  if (!profile) return auth().redirectToSignIn();

  if (!params.inviteId) return redirect("/");

  const existingServer = await prismadb.server.findFirst({
    where: {
      inviteCode: params.inviteId,
      Member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });

  if (existingServer) return redirect(`/server/${existingServer.id}`);

  const server = await prismadb.server.update({
    where: {
      inviteCode: params.inviteId,
    },
    data: {
      Member: {
        create: [
          {
            profileId: profile.id,
          },
        ],
      },
    },
  });

  if (server) return redirect(`/server/${server.id}`);
  return null;
};

export default InviteIdPage;
