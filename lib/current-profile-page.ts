import { getAuth } from "@clerk/nextjs/server";
import prismadb from "./prismadb";
import { NextApiRequest } from "next";

export const currentPageProfile = async (req: NextApiRequest) => {
  const { userId } = getAuth(req);

  if (!userId) return null;

  const profile = await prismadb.profile.findUnique({
    where: {
      userId,
    },
  });

  return profile;
};
