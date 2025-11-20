import { useEffect, useRef, useState } from "react";
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
import { fetchAgents } from "../../redux/slice/agentsSlice";
import { updateThread } from "../../redux/slice/threadSlice";

export default function Chats() {
  const dispatch = useDispatch<AppDispatch>();
  const { threads = [] } = useSelector((state: RootState) => state.thread);
  const totalThread = useSelector((state:RootState)=>state.thread.totalThreads)
  const { socket } = useSocket();
  const location = useLocation();
  const notificationThreadId = location.state?.threadId;
  const [selectedThreadId, setSelectedThreadId] = useState<string | null>(null);
  const [selectedThreadType, setSelectedThreadType] = useState<string>(ThreadType.UNASSIGNED);
  const [isLoading, setIsLoading] = useState(true);
  const {user} = useSelector((state: RootState) => state.user);
  const selectedThread = threads.find((thread)=> selectedThreadId === thread.id)
  const [page,Setpage] = useState(1)
  const listRef = useRef<HTMLDivElement>()
  // const [isUpdated,setIsUpdated] = useState<boolean>(false)
   useEffect(() => {
    setIsLoading(true);
    dispatch(getAllThreads({page})).then((res: any) => {
     const loadedThreads = Array.isArray(res.payload?.thread)
    ? res.payload.thread
    : [];
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
    }).catch((error) => {
        console.error("Failed to load threads", error);
      }).finally(() => {
        setIsLoading(false);
      });
   }, [dispatch, notificationThreadId]);
  useEffect(() => {
  if (user?.orgId) {
    dispatch(fetchAgents(user.orgId));
  }
}, [dispatch, user?.orgId]);


// now creating the useeffect for the scroll 
useEffect(() => {
  const el = listRef.current;
  if (!el) return;

  const handleScroll = () => {
    const isNearBottom = el.scrollTop + el.clientHeight >= el.scrollHeight - 50;
    console.log("Pagination triggered");
    if (isNearBottom && totalThread && threads.length < totalThread) {
      console.log("Pagination triggered");
      dispatch(getAllThreads({ page: page + 1 }));
      Setpage(prev => prev + 1);
    }
  };

  el.addEventListener("scroll", handleScroll);

  return () => {
    el.removeEventListener("scroll", handleScroll);
  };
}, [threads.length, totalThread, page,listRef.current]);


  
  useEffect(() => {
    if (!socket || !selectedThreadId) return;
    const handleThreadStatusUpdated = (data: { threadId: string; status: string }) => {
      if (data.threadId === selectedThreadId && selectedThread) {
        dispatch(updateThread({ ...selectedThread, status: data.status }));
      }
    };
    socket.on("trashThread",({ThreadId})=>{
      const IsThread =  threads.find((thread)=>thread.id === ThreadId)
      if(IsThread){
        dispatch(updateThread({...IsThread,type:ThreadType.TRASH}));
      }
    })

    socket.on("threadAssigned",({threadId,agentId}:{threadId:string,agentId:string})=>{
      const IsThread = threads.find((thread)=>thread.id === threadId)
      if (IsThread) {
        dispatch(updateThread({...IsThread,assignedTo:agentId,type:ThreadType.ASSIGNED}));
      }
    })
    socket.on("threadEnded",({threadId,ended_by}:{threadId:string,ended_by:string})=>{
      const IsThread = threads.find((thread)=>thread.id === threadId)
      if(IsThread){
        dispatch(updateThread({...IsThread,status:"ended",type:ThreadType.COMPLETED,endedBy:ended_by}))
      }
    })
    socket.on("threadStatusUpdated", handleThreadStatusUpdated);
    socket.emit("joinThreadRoom", { threadId: selectedThreadId });
    return () => {
      socket.off("threadStatusUpdated", handleThreadStatusUpdated);
      socket.off("threadAssigned")
    };
  }, [socket, selectedThreadId, selectedThread, dispatch]);
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
          if(selectedThreadType === "trash"){
            return thread.type === selectedThreadType && thread.type === "trash";
          }
          if(selectedThreadType === ThreadType.COMPLETED){
            return thread.type === selectedThreadType && thread.type === "completed"
          }
          return thread.type === selectedThreadType;
        })}
        onSelectThread={setSelectedThreadId}
        type={selectedThreadType}
        selectedThreadId={selectedThreadId}
        // listRef={listRef}
      />
        <ChatArea 
          selectedThreadId={selectedThreadId}
          onSelectThread={setSelectedThreadId}
          threads={threads}
          // threads={threads.filter((thread) => {
          //   if (selectedThreadType === "assigned") {
          //     return thread.type === selectedThreadType && thread.assignedTo === user?.id;
          //   }
          //   if (selectedThreadType === "open") {
          //     return true;
          //   }
          //   return thread.type === selectedThreadType;
          // })}
          onClose={()=>setSelectedThreadId(null)}
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