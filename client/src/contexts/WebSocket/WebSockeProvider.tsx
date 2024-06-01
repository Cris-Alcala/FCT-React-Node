import React, { useContext, ReactNode } from "react";
import initSocket from "@/services/socket";
import { WebSocketContext } from "./WebSocketContext";

interface SocketProviderProps {
  children: ReactNode;
}

export const SocketProvider: React.FC<SocketProviderProps> = ({ children }) => {
  const socket = initSocket();

  return (
    <WebSocketContext.Provider value={socket}>
      {children}
    </WebSocketContext.Provider>
  );
};

export const useWebSocket = () => useContext(WebSocketContext);
