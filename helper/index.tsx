import { MemberRole } from "@prisma/client";
import { ShieldCheck, ShieldAlert } from "lucide-react";

export const roleIconMap = {
  [MemberRole.GUEST]: null,
  [MemberRole.MODERATOR]: (
    <ShieldCheck className="mr-2 text-indigo-500 size-4" />
  ),
  [MemberRole.ADMIN]: <ShieldAlert className="mr-2 text-rose-500 size-4" />,
};
