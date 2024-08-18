import { initialProfile } from "@/lib/init-datebase/profile";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

type Props = {
  children: ReactNode;
};

async function SetUpLayout({ children }: Props) {
  const profile = await initialProfile();
  const server = await prismadb.server.findFirst({
    where: {
      Member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  if (server) {
    return redirect(`/server/${server.id}`);
  }

  return <>{children}</>;
}

export default SetUpLayout;
