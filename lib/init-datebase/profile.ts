import { auth, currentUser, redirectToSignIn } from "@clerk/nextjs/server";
import prismadb from "../prismadb";

export const initialProfile = async () => {
  const user = await currentUser();
  if (!user) {
    return auth().redirectToSignIn();
  }

  const profile = await prismadb.profile.findUnique({
    where: {
      userId: user.id,
    },
  });

  if (profile) {
    return profile;
  }

  const newProfile = await prismadb.profile.create({
    data: {
      userId: user.id,
      email: user.emailAddresses[0].emailAddress,
      name: `${user.firstName} ${user.lastName}`,
      imageUrl: user.imageUrl,
    },
  });

  return newProfile;
};
