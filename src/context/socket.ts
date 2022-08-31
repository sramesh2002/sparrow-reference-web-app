import { createContext } from "react";
import { Socket } from "socket.io-client";
import {
  ServerToClientEvents,
  ClientToServerEvents,
} from "../pages/api/socket";

// todo kind of works
// export const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io();
export const socketContextObj = {
  socket: null,
  setSocket: (
    someSocket: Socket<ServerToClientEvents, ClientToServerEvents>
  ) => {},
};

export const SocketContext = createContext(socketContextObj);
