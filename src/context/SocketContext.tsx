import { createContext, useContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useSelector } from "react-redux";
import { RootState } from "../redux/store/store";

// const SOCKET_URL = import.meta.env.VITE_SOCKET_URL;
const SOCKET_URL = 'http://localhost:5003';

interface SocketContextType {
  socket: Socket | null;
}

// Create a context with a default value of null
const SocketContext = createContext<SocketContextType>({ socket: null });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const {user}= useSelector((state:RootState)=>state.user)

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ["websocket", "polling"],
      withCredentials: true,
      // reconnection: true, // default true
      // reconnectionAttempts: 5,
      // reconnectionDelay: 1000,
    });

    newSocket.on("connect", () => {console.log("✅ Connected to WebSocket")
       if (user?.orgId && user?.id) {
        newSocket.emit("registerOrg", {
          orgId: user.orgId,
          userId: user.id,
          role: user.role || "agent", 
        });
      }
    });
   
    newSocket.on("disconnect", () => console.log("❌ Disconnected from WebSocket"));
    newSocket.on("connect_error", (err) => console.error("⚠️ Connection error:", err));

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user,user?.orgId,user?.role]);

  return <SocketContext.Provider value={{ socket }}>{children}</SocketContext.Provider>;
};

export const useSocket = () => useContext(SocketContext);
