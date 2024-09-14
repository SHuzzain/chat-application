import { Server as NetServer, Socket } from "net";
import { NextApiResponse } from "next";
import { Server as SocketIOServer } from "socket.io";

import { Member, Profile, Server } from "@prisma/client";

export interface ServerWithMemberProfile extends Server {
  Member: (Member & { profile: Profile })[];
}

export interface NextApiResposeServerIO extends NextApiResponse {
  socket: Socket & {
    server: NetServer & {
      io: SocketIOServer;
    };
  };
}
