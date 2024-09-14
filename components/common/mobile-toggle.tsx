import React from "react";
import { Menu } from "lucide-react";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

import NavigationSideBar from "@/components/navigation/navigation-sidebar";
import ServerSideBar from "@/components/server/server-sidebar";

type Props = {
  serverId: string;
};

const MobileToggle = ({ serverId }: Props) => {
  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button size={"icon"} variant={"ghost"} className="md:hidden">
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        side={"left"}
        className="flex gap-0 p-0 [&>button]:!right-10"
      >
        <div className="w-20">
          <NavigationSideBar />
        </div>
        <ServerSideBar serverId={serverId} />
      </SheetContent>
    </Sheet>
  );
};

export default MobileToggle;
