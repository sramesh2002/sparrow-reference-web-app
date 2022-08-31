/* eslint-disable @typescript-eslint/no-unsafe-member-access */
// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import { Server } from "socket.io";

export interface ServerToClientEvents {
  noArg: () => void;
  basicEmit: (a: number, b: string, c: Buffer) => void;
  withAck: (d: string, callback: (e: number) => void) => void;
}

export interface ClientToServerEvents {
  hello: () => void;
}

export interface InterServerEvents {
  ping: () => void;
}

export interface SocketData {
  name: string;
  age: number;
}

export default function SocketHandler(
  req: NextApiRequest,
  res: NextApiResponse | any
) {
  if (res.socket.server.io) {
    console.log("Socket is already running");
  } else {
    console.log("Socket is initializing");
    const io = new Server<
      ClientToServerEvents,
      ServerToClientEvents,
      InterServerEvents,
      SocketData
    >(res.socket.server);
    res.socket.server.io = io;

    io.on("connection", (socket) => {
      console.log("Socket server connected");

      socket.on("gateway name updated", (gatewayName) => {
        console.log("gateway name updated", gatewayName);
        socket.broadcast.emit("gateway updated", gatewayName);
      });

      socket.on("disconnect", () => console.log("Socket client disconnected"));
    });
  }
  res.end();
}

export const config = {
  api: {
    bodyParser: false,
  },
};
