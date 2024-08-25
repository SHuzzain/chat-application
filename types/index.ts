import { Member, Profile, Server } from "@prisma/client";

export interface ServerWithMemberProfile extends Server {
  Member: (Member & { profile: Profile })[];
}
