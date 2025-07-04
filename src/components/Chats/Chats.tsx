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
import { useLocation } from "react-router-dom";
import AssignedDropDown from "../Tasks/AssignedDropDown/AssignedDropDown";
import { fetchAgents } from "../../redux/slice/agentsSlice";
import { DropDownPurpose } from "../../enums";
export default function Chats() {
  const dispatch = useDispatch<AppDispatch>();
  const { threads = [] } = useSelector((state: RootState) => state.thread);
  const { socket } = useSocket();
  const location = useLocation();
  const notificationThreadId = location.state?.threadId;
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedThreadType, setSelectedThreadType] = useState<string>(ThreadType.UNASSIGNED);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useSelector((state: RootState) => state.user);
  const selectedThread = threads.find((thread)=> selectedThreadId === thread.id)
  const [isUpdated,setIsUpdated] = useState<boolean>(false)
  useEffect(() => {
    setIsLoading(true);
    dispatch(getAllThreads()).then((res: any) => {
      const loadedThreads = res.payload || [];
      if (notificationThreadId) {
        const matchedThread = loadedThreads.find(
          (t: any) => t.id === notificationThreadId
        );
        if (matchedThread) {
          setSelectedThreadId(matchedThread.id);
        }
      }
      setIsLoading(false);
      window.history.replaceState({}, document.title);
    });
  }, [dispatch, notificationThreadId,isUpdated,selectedThreadId]);
  useEffect(() => {
  if (user?.orgId) {
    dispatch(fetchAgents(user.orgId));
  }
}, [dispatch, user?.orgId]);
  // useEffect(() => {
  //   if (threads.length > 0 && !selectedThreadId) {
  //     setSelectedThreadId(threads[0].id);
  //   }
  // }, [threads, selectedThreadId]);
  useEffect(() => {
    if (!socket) return;
    const handleAnyEvent = (eventName: string, ...args: any[]) => {
      console.log(`:satellite_antenna: Event received: ${eventName}`, args);
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
      {selectedThreadType ? (
        <>
        <ChatList
        threads={threads.filter((thread) => {
          if (selectedThreadType === "assigned") {
            return thread.type === selectedThreadType && thread.assignedTo === user?.id;
          }
          if (selectedThreadType === "open") {
            return true;
          }
          return thread.type === selectedThreadType;
        })}
        onSelectThread={setSelectedThreadId}
        type={selectedThreadType}
        selectedThreadId={selectedThreadId}
      />
        <ChatArea
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
          threads={threads.filter((thread) => {
            if (selectedThreadType === "assigned") {
              return thread.type === selectedThreadType && thread.assignedTo === user?.id;
            }
            if (selectedThreadType === "open") {
              return true;
            }
            return thread.type === selectedThreadType;
          })}
          onClose={()=>setSelectedThreadId(null)}
          assignedDropdown={
  selectedThread ? (
    <AssignedDropDown
      taskId={selectedThread.id}
      assignedTo={selectedThread.assignedTo||""}
      purpose={DropDownPurpose.Thread}
      setIsUpdated={setIsUpdated}
    />
  ) : null}
        />
        </>
      ) : (
        <PlaceholderContainer>
          <img
            src="https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg"
            alt="No conversation selected"
            width="300"
          />
          <Typography fontFamily={"var(--custom-font-family)"} sx={{ color: "#000000" }}>
            Select a thread to view messages.
          </Typography>
        </PlaceholderContainer>
      )}
    </ChatContainer>
  );
}