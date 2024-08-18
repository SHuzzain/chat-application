import React from "react";

type Props = {
  children: React.ReactNode;
};

const Mainlayout = ({ children }: Props) => {
  return <>{children}</>;
};

export default Mainlayout;
