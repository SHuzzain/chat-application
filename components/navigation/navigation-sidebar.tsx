import { currentProfile } from "@/lib/current-profile";
import prismadb from "@/lib/prismadb";
import { redirect } from "next/navigation";
import React from "react";
import NavigationAction from "./navigation-action";
import { Separator } from "../ui/separator";
import { ScrollArea } from "../ui/scroll-area";
import NavigationItem from "./navigation-item";
import { ModeToggle } from "./dark-mode";
import { UserButton } from "@clerk/nextjs";

type Props = {};

const NavigationSideBar = async (props: Props) => {
  const profile = await currentProfile();
  if (!profile) return redirect("/");
  const servers = await prismadb.server.findMany({
    where: {
      Member: {
        some: {
          profileId: profile.id,
        },
      },
    },
  });
  return (
    <div className="flex flex-col items-center space-y-4 bg-aside_nav py-3 border-r text-primary size-full">
      <NavigationAction />
      <Separator className="bg-zinc-300 dark:bg-zinc-700 mx-auto rounded-md w-10 h-[2px]" />
      <ScrollArea className="flex-1 w-full">
        {servers.map((server) => (
          <div key={server.id} className="mb-4">
            <NavigationItem
              id={server.id}
              name={server.name}
              imageUrl={server.imageUrl}
            />
          </div>
        ))}
      </ScrollArea>
      <div className="flex flex-col items-center gap-4 mt-auto pb-3">
        <ModeToggle />

        <UserButton
          appearance={{
            elements: {
              avatarBox: "size-12",
            },
          }}
        />
      </div>
    </div>
  );
};

export default NavigationSideBar;
