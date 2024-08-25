import NavigationSideBar from "@/components/navigation/navigation-sidebar";
import React from "react";

type Props = {
  children: React.ReactNode;
};

const Mainlayout = ({ children }: Props) => {
  return (
    <div className="h-full">
      <div className="z-30 fixed inset-y-0 md:flex flex-col hidden w-20 h-full">
        <NavigationSideBar />
      </div>
      <main className="md:pl-20 h-full">{children}</main>
    </div>
  );
};

export default Mainlayout;
