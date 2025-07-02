import { useEffect, useState } from "react";
import { useSocket } from "../../context/SocketContext";

const SocketListener = () => {
  const { socket } = useSocket();
  const [latestEvent, setLatestEvent] = useState<string | null>(null);

  useEffect(() => {
    if (!socket) return;

    const handleAnyEvent = (eventName: string, ...args: any[]) => {
      console.log(`📡 Event received: ${eventName}`, args);
      setLatestEvent(eventName);
    };

    socket.onAny(handleAnyEvent);

    return () => {
      socket.offAny(handleAnyEvent);
    };
  }, [socket]);

  return <p>Last event received: {latestEvent || "None"}</p>;
};

export default SocketListener;
