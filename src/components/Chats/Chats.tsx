import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllThreads } from "../../redux/slice/threadSlice";
import { AppDispatch, RootState } from "../../redux/store/store";
import ChatArea from "./ChatArea/ChatArea";
import ChatList from "./ChatList/ChatList";
import ChatSideBar from "./ChatSideBar/ChatSideBar";
import { useSocket } from "../../context/SocketContext";
import Loader from "../../components/Loader";
import { ChatContainer } from "./ChatSideBar/chatSidebar.styled";
import { ThreadType } from "../../enums";
import { PlaceholderContainer } from "./ChatArea/chatArea.styled";
import { Typography } from "@mui/material";

export default function Chats() {
  const dispatch = useDispatch<AppDispatch>();
  const { threads = [] } = useSelector((state: RootState) => state.thread);
  const { socket } = useSocket();

  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedThreadType, setSelectedThreadType] = useState<string>(ThreadType.UNASSIGNED);
  const [isLoading, setIsLoading] = useState(true);

  // Fetch threads on mount.
  useEffect(() => {
    dispatch(getAllThreads()).finally(() => setIsLoading(false));
  }, [dispatch]);

  // If the current selection is no longer valid (e.g., after a search), clear it.
  useEffect(() => {
    if (selectedThreadId && !threads.find((thread) => thread.id === selectedThreadId)) {
      setSelectedThreadId(null);
    }
  }, [threads, selectedThreadId]);

  // Optionally auto-select the first thread when available.
  useEffect(() => {
    if (threads.length > 0 && !selectedThreadId) {
      setSelectedThreadId(threads[0].id);
    }
  }, [threads, selectedThreadId]);

  // (Optional) Socket handling for real-time events.
  useEffect(() => {
    if (!socket) return;
    const handleAnyEvent = (eventName: string, ...args: any[]) => {
      console.log(`📡 Event received: ${eventName}`, args);
      // Add any additional logic as needed.
    };
    socket.onAny(handleAnyEvent);
    return () => {
      socket.offAny(handleAnyEvent);
    };
  }, [socket]);

  if (isLoading) return <Loader />;

  return (
    <ChatContainer>
      <ChatSideBar 
        selectedType={selectedThreadType} 
        onSelectType={setSelectedThreadType} 
      />
      <ChatList
        // Pass threads filtered by the selected type.
        threads={threads.filter((thread) => thread.type === selectedThreadType)}
        onSelectThread={setSelectedThreadId}
        type={selectedThreadType}
        selectedThreadId={selectedThreadId}
      />
      {selectedThreadId ? (
        <ChatArea
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
        />
      ) : (
        <PlaceholderContainer>
          <img
            src="https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg"
            alt="No conversation selected"
            width="300"
          />
          <Typography sx={{ color: "#000000" }}>
            Select a thread to view messages.
          </Typography>
        </PlaceholderContainer>
      )}
    </ChatContainer>
  );
}
