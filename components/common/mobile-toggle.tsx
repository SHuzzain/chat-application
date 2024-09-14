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
        <div className="md:hidden mr-3">
          <Button variant="ghost">
            <Menu />
          </Button>
        </div>
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
