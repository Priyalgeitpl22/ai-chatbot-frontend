import { useState, useEffect, useCallback, useRef,useLayoutEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Send, X } from "lucide-react";  
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { getChats, addchat } from "../../../redux/slice/chatSlice";
import { useSocket } from "../../../context/SocketContext";
import {
  ChatContainer,
  ChatHeader,
  ChatMessages,
  ChatInputContainer,
  PlaceholderContainer,
  BotMessage,
  BotMessageBubble,
  UserMessage,
  UserMessageBubble,
} from "./chatArea.styled";
import { ChatListHeader, TimeStamp } from "../ChatList/chatList.styled";
import { formatTimestamp } from "../../../utils/utils";
import { Thread } from "../../../redux/slice/threadSlice";
import { Task } from "../../../redux/slice/taskSlice";

interface ChatData {
  id: string;
  sender: string;
  threadId: string;
  content: string;
  createdAt: string;
}

interface ChatAreaProps {
  selectedThreadId: string | null;
  onSelectThread?: (type: string) => void;
  onClose?: () => void;
  assignedDropdown?: React.ReactNode;
  threads?: Thread[];
  tasks?: Task[];
}

const motionVariants = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0 },
};

export default function ChatArea({ selectedThreadId, threads=[], tasks=[], onClose, assignedDropdown }: ChatAreaProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();
  const { chats, loading } = useSelector((state: RootState) => state.chats);
  const {id} = useSelector((state:RootState)=>state.auth)
  const [inputMessage, setInputMessage] = useState("");
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [delayedLoading, setDelayedLoading] = useState(loading);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  // useEffect(() => {
  //   setTimeout(() => {
  //     requestAnimationFrame(scrollToBottom);
  //   },100);
  // }, [chats]);

  useLayoutEffect(() => {
    setTimeout(() => {
      requestAnimationFrame(scrollToBottom);
    }, 100);
  }, [chats]);

  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => setDelayedLoading(false), 500);
      return () => clearTimeout(timer);
    }
    setDelayedLoading(true);
  }, [loading]);

  useEffect(() => {
    if (selectedThreadId) {
      dispatch(getChats(selectedThreadId));
    }
  }, [dispatch, selectedThreadId]);

  useEffect(() => {
    if (!socket || !selectedThreadId) return;

    const handleReceiveMessage = (newMessage: ChatData) => {
      if (newMessage.threadId === selectedThreadId) {
        dispatch(addchat(newMessage));
      }
    };

    const handleUpdateDashboard = (data: ChatData) => {
      if (data.sender === "User" && data.threadId === selectedThreadId) { 
        dispatch(addchat(data));
      }
    };

    const handleTyping = ({ agentName }: { agentName: string }) => {
      setTypingAgent(agentName);
    };

    const handleStopTyping = () => {
      setTypingAgent(null);
    };

    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("updateDashboard", handleUpdateDashboard);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("updateDashboard", handleUpdateDashboard);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedThreadId, dispatch]);

  const handleTyping = useCallback(() => {
    if (!socket || !selectedThreadId) return;

    socket.emit("typing", { threadId: selectedThreadId, agentName: "Agent" });

    if (typingTimeout) clearTimeout(typingTimeout);

    setTypingTimeout(
      setTimeout(() => {
        socket.emit("stopTyping", { threadId: selectedThreadId });
      }, 3000)
    );
  }, [socket, selectedThreadId, typingTimeout]);

  const sendMessage = useCallback(() => {
    if (!socket || !selectedThreadId || !inputMessage.trim()) return;

    socket.emit("stopTyping", { threadId: selectedThreadId });

    const messageData: ChatData = {
      id: Date.now().toString(),
      threadId: selectedThreadId,
      sender: "Bot",
      content: inputMessage.trim(),
      createdAt: new Date().toISOString(),
    };

    socket.emit("updateDashboard", {
      sender: "Bot",
      content: messageData.content,
      threadId: selectedThreadId,
      
    });

    dispatch(addchat(messageData));
    setInputMessage("");
  }, [socket, selectedThreadId, inputMessage, dispatch]);

  const threadInfo = threads?.find(thread => thread.id === selectedThreadId);
  const userInfo = threadInfo? threadInfo:tasks[0];

  return (
    <ChatContainer>
      {!selectedThreadId || selectedThreadId==="" ? (
        <>
          <ChatListHeader>
            <Typography
              variant="h6"
              sx={{ fontFamily: "var(--custom-font-family)", fontWeight: 600 }}
            >
              Conversations
            </Typography>
          </ChatListHeader>
          <PlaceholderContainer>
            <img
              src="https://img.freepik.com/free-vector/cartoon-style-robot-vectorart_78370-4103.jpg"
              alt="No conversation selected"
              width="300"
            />
            <Typography sx={{ fontFamily: "var(--custom-font-family)", color: "#000000" }}>
              Select a conversation to start chatting
            </Typography>
          </PlaceholderContainer>
        </>
      ) : (
        <>
          <ChatHeader>
            <Box display="flex" alignItems="center" gap={2} sx={{ flexGrow: 1 }}>
              <Avatar style={{ backgroundColor: "var(--theme-color)" }}>
                {userInfo?.name?.charAt(0).toUpperCase() || 'U'}
              </Avatar>
              <Typography variant="subtitle1" fontFamily={"var(--custom-font-family)"}>
                {(userInfo?.name?.charAt(0).toUpperCase() + userInfo?.name?.slice(1)) || 'Unkown Visitor'}
              </Typography>
            </Box>
            {assignedDropdown &&
              <Box mr={2} style={{fontFamily: "var(--custom-font-family)", fontSize: "1rem", color: "#35495c", display: 'flex', alignItems: 'center', gap: '10px' }}>
                <Typography> Assigned to: </Typography>
                <Typography>{assignedDropdown}</Typography>
              </Box>
            }
            <IconButton onClick={onClose} sx={{ padding: 0 }}>
              <X size={24} />
            </IconButton>
          </ChatHeader>
          <ChatMessages id="chatMessagesContainer">
            {delayedLoading ? (
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  py: 2,
                }}
              >
                <CircularProgress size={24} />
              </Box>
            ) : chats.length > 0 ? (
              <>
                {chats.map((chat) => {
                  const isBot = chat.sender === "Bot";
                  return (
                    <motion.div
                      key={chat.id}
                      initial="hidden"
                      animate="visible"
                      variants={motionVariants}
                    >
                      {isBot ? (
                        <BotMessage>
                          <TimeStamp>
                            {chat.sender} • {formatTimestamp(chat.createdAt)}
                          </TimeStamp>
                          <BotMessageBubble>{chat.content}</BotMessageBubble>
                        </BotMessage>
                      ) : (
                        <UserMessage>
                          <TimeStamp>
                            {chat.sender} • {formatTimestamp(chat.createdAt)}
                          </TimeStamp>
                          <UserMessageBubble>{chat.content}</UserMessageBubble>
                        </UserMessage>
                      )}
                    </motion.div>
                  );
                })}
                <div ref={messagesEndRef} />
              </>
            ) : (
              <Typography fontFamily={"var(--custom-font-family)"}>No messages yet.</Typography>
            )}

            {typingAgent && (
              <Typography sx={{ fontStyle: "italic", color: "#888", mt: 1 }}>
                {typingAgent} is typing...
              </Typography>
            )}
          </ChatMessages>

          <ChatInputContainer>
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Write a message..."
              multiline
              maxRows={4}
              value={inputMessage}
              onChange={(e) => {
                setInputMessage(e.target.value);
                handleTyping();
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  sendMessage();
                }
              }}
              InputProps={{
                endAdornment: (
                  <IconButton color="primary" onClick={sendMessage} disabled={!inputMessage.trim()}>
                    <Send size={20} />
                  </IconButton>
                ),
              }}
            />
          </ChatInputContainer>
        </>
      )}
    </ChatContainer>
  );
}
