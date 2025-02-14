import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllThreads } from "../../redux/slice/threadSlice";
import { AppDispatch, RootState } from "../../redux/store/store";
import ChatArea from "./ChatArea/ChatArea";
import ChatList from "./ChatList/ChatList";
import { ChatContainer } from "./Chats.styled";
import ChatSideBar from "./ChatSideBar/ChatSideBar";
import { useParams, useNavigate } from "react-router-dom";
import { useSocket } from "../../context/SocketContext";
import Loader from "../../components/Loader";

export default function Chats() {
  const dispatch = useDispatch<AppDispatch>();
  const { threads } = useSelector((state: RootState) => state.thread);
  const { type, threadId } = useParams<{ type: string; threadId: string }>();
  const navigate = useNavigate();
  const { socket } = useSocket();

  // Local state for the selected thread ID.
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(
    threadId || null
  );
  const [messages, setMessages] = useState<any[]>([]); // Stores chat messages
  const [lastEvent, setLastEvent] = useState<string | null>(null); // Track last event
  const [isLoading, setIsLoading] = useState(true);

  // Wait 2 seconds, then dispatch the API call.
  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(getAllThreads());
      setIsLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, [dispatch]);

  // Navigate to default chat type once threads are loaded.
  useEffect(() => {
    if (threads.length > 0) {
      const currentType = type || "unassigned";
      navigate(`/chats/${currentType}`, { replace: true });
    }
  }, [threads, type, threadId, navigate]);

  // Setup socket event listener.
  useEffect(() => {
    if (!socket) return;

    const handleAnyEvent = (eventName: string, ...args: any[]) => {
      console.log(`📡 Event received: ${eventName}`, args);
      setLastEvent(eventName);
      if (eventName === "receiveMessage") {
        setMessages((prevMessages) => [...prevMessages, args[0]]);
      }
    };

    socket.onAny(handleAnyEvent);

    return () => {
      socket.offAny(handleAnyEvent);
    };
  }, [socket]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ChatContainer>
      <ChatSideBar selectedType={type || "unassigned"} />
      <ChatList
        threads={threads.filter(
          (thread) => thread.type === (type || "unassigned")
        )}
        onSelectThread={(newThreadId: string) => setSelectedThreadId(newThreadId)}
        type={type || "unassigned"}
      />
      <ChatArea selectedThreadId={selectedThreadId} />
    </ChatContainer>
  );
}
