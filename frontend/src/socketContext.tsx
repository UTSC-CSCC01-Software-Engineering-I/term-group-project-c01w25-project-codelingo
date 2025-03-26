import { createContext, useContext, useEffect, useState } from "react";
import io, { Socket } from "socket.io-client";
import { config } from "./config";

const { match } = config.api;

// Create a Context for the socket
const SocketContext = createContext(null);

export const useSocket = () => {
  return useContext(SocketContext);
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    const newSocket: Socket = io(match);
    setSocket(newSocket);

    // Clean up the socket connection on unmount
    return () => {
      newSocket.close();
    };
  }, []); 

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};
