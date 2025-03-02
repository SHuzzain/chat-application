import { Server as NetServer } from "http";
import { NextApiRequest } from "next";
import { Server as ServerIO } from "socket.io";
import { NextApiResposeServerIO } from "@/types";

export const config = {
  api: {
    bodyParser: false,
  },
};

const ioHeadler = (req: NextApiRequest, res: NextApiResposeServerIO) => {
  if (!res.socket.server.io) {
    console.log("Initializing Socket.io server...");

    const path = "/api/socket/io";
    const httpServer: NetServer = res.socket.server as any;
    const io = new ServerIO(httpServer, {
      path,
      addTrailingSlash: false,
    });
    res.socket.server.io = io;
  }

  res.end();
};

export default ioHeadler;
