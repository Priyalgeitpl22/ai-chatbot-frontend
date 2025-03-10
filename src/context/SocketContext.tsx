import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
// const SOCKET_URL = 'http://localhost:5003';

interface SocketContextType {
  socket: Socket | null;
}

// Create a context with a default value of null
const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
    });

    newSocket.on("connect", () => console.log("✅ Connected to WebSocket"));
    newSocket.on("disconnect", () => console.log("❌ Disconnected from WebSocket"));
    newSocket.on("connect_error", (err) => console.error("⚠️ Connection error:", err));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, []);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
