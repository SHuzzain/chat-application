import React from "react";
import { Avatar, AvatarImage } from "../ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  src: string;
  className?: string;
};

const UserAvatar = ({ src, className }: Props) => {
  return (
    <Avatar className={cn("size-7 md:size-10", className)}>
      <AvatarImage src={src} />
    </Avatar>
  );
};

export default UserAvatar;
