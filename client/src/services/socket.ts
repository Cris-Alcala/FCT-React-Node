import { io, Socket } from "socket.io-client";

export default function initSocket(): Socket {
  const socket = io();

  return socket;
}
