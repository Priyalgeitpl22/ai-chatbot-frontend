import { useState, useEffect, useCallback, useRef, useLayoutEffect } from "react";
import {
  Avatar,
  Box,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
} from "@mui/material";
import { Send } from "lucide-react";  
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { getChats, addchat, uploadChatFile } from "../../../redux/slice/chatSlice";
import { useSocket } from "../../../context/SocketContext";
import { toast } from "react-toastify";
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
  OptionSelect,
  AgentsListDropDown,
  CloseConvButton,
  MoreDetailVerticalIcon,
  MoreInfoIconDetail,
  InfoDetail
} from "./chatArea.styled";
import { ChatListHeader, TimeStamp } from "../ChatList/chatList.styled";
import { formatTimestamp } from "../../../utils/utils";
import { Thread, updateThread, assignThread } from "../../../redux/slice/threadSlice";
import { Task } from "../../../redux/slice/taskSlice";
import { ThreadType } from "../../../enums";
import EmojiPicker from 'emoji-picker-react';
import InsertEmoticonIcon from '@mui/icons-material/InsertEmoticon';
import AttachFileIcon from '@mui/icons-material/AttachFile';
import Popover from '@mui/material/Popover';
import Modal from "@mui/material/Modal";
import InsertDriveFileIcon from '@mui/icons-material/InsertDriveFile';
import DownloadIcon from '@mui/icons-material/Download';
import AssignedDropDown from '../../Tasks/AssignedDropDown/AssignedDropDown';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import EmailIcon from '@mui/icons-material/Email';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import ErrorIcon from '@mui/icons-material/Error';
import BlockIcon from '@mui/icons-material/Block';
import InfoIcon from '@mui/icons-material/Info';
import PersonIcon from '@mui/icons-material/Person';

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

const MoreOptions= [
  {
    icon:<EmailIcon color="primary"/>,
    message:"Email Chat Tansacript"
  },
   {
    icon:<DeleteOutlineIcon color="primary"/>,
    message:"Move to trash"
  },
   {
    icon:<BlockIcon color="primary"/>,
    message:"Block Sender"
  },
   {
    icon:<ErrorIcon color="primary"/>,
    message:"Mark as spam"
  }
]

export default function ChatArea({ selectedThreadId, threads=[], tasks=[], onClose }: ChatAreaProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { socket } = useSocket();
  const { chats, loading } = useSelector((state: RootState) => state.chats);
  const { user } = useSelector((state:RootState)=> state.user)
  const [inputMessage, setInputMessage] = useState("");
  const [typingAgent, setTypingAgent] = useState<string | null>(null);
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(
    null
  );
  const [delayedLoading, setDelayedLoading] = useState(loading);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [openImage, setOpenImage] = useState<string | null>(null);
  const { data: agents } = useSelector((state: RootState) => state.agents);
  const [assignPopoverOpen, setAssignPopoverOpen] = useState(false);
  const [assignAnchorEl, setAssignAnchorEl] = useState<null | HTMLElement>(null);
  const threadInfo: Thread | undefined = useSelector((state: RootState) =>state.thread.threads.find((thread) => thread.id === selectedThreadId));
  const userInfo = threadInfo ? threadInfo : tasks[0];
  const assignedAgentId = threadInfo?.assignedTo || '';
  const assignedAgent = agents?.find(agent => agent.id === assignedAgentId);
  const [moreDetailAnchorEl, setMoreDetailAnchorEl] = useState<HTMLElement | null>(null);

  const [assignedValue, setAssignedValue] = useState<string>("");

  useEffect(() => {
    setAssignedValue(threadInfo?.assignedTo || "");
  }, [threadInfo?.assignedTo]);

  const scrollToBottom = () => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" });
    }
  };

  const handleMoreDetailClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setMoreDetailAnchorEl(event.currentTarget);
  };

  const handleMoreDetailClose = () => {
    setMoreDetailAnchorEl(null);
  };

  const openMoreDetail = Boolean(moreDetailAnchorEl);
  const id = openMoreDetail ? 'simple-popover' : undefined;

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
        socket.emit("readMessage",({selectedThreadId}))
      }
    };
    const handleNewMessage = (data:any)=>{
      if (
        data.data.sender === "User" &&
        data.data.threadId === selectedThreadId &&
        !data.data.fileData 
      ) {
        const response = {
          id: "",
          threadId: data.data.threadId,
          sender: data.data.sender,
          content: data.data.content,
          createdAt: data.data.createdAt,
        };
        dispatch(addchat(response));
      }
    }

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
    socket.on("newMessage",handleNewMessage);
    socket.on("typing", handleTyping);
    socket.on("stopTyping", handleStopTyping);

    return () => {
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("updateDashboard", handleUpdateDashboard);
      socket.off("newMessage",handleNewMessage);
      socket.off("typing", handleTyping);
      socket.off("stopTyping", handleStopTyping);
    };
  }, [socket, selectedThreadId, dispatch]);

  const isTicketCreated = threadInfo?.status === 'ticket_created';

  useEffect(() => {
    if (!socket || !selectedThreadId) return;

    const handleThreadStatusUpdated = (data: { threadId: string; status: string }) => {
      if (data.threadId === selectedThreadId && threadInfo) {
        dispatch(updateThread({ ...threadInfo, status: data.status }));
      }
    };

    socket.on("threadStatusUpdated", handleThreadStatusUpdated);

    socket.emit("joinThreadRoom", { threadId: selectedThreadId });

    return () => {
      socket.off("threadStatusUpdated", handleThreadStatusUpdated);
    };
  }, [socket, selectedThreadId, threadInfo, dispatch]);

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
    if (!socket || !selectedThreadId || !inputMessage.trim() || isTicketCreated) return;

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
      agentId:user?.id
    });

    const tempThread = threads.find(thread => thread.id === selectedThreadId);

if (tempThread && (tempThread.type !== ThreadType.ASSIGNED || tempThread.assignedTo !== user?.id)) {
  const updatedThread: Thread = {
    ...tempThread,
    type: ThreadType.ASSIGNED,
    assignedTo: user?.id || null,
  };

  dispatch(updateThread(updatedThread));
}

    setInputMessage("");
  }, [socket, selectedThreadId, inputMessage, dispatch]);

  const handleEmojiClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
    setShowEmojiPicker((prev) => !prev);
  };

  const handleEmojiSelect = (emojiData: any) => {
    setInputMessage((prev) => prev + emojiData.emoji);
    setShowEmojiPicker(false);
    setAnchorEl(null);
  };

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isTicketCreated) return; // Prevent file upload if chat is inactive
    const file = event.target.files?.[0];
    if (!file || !selectedThreadId || !socket) return;

    try {
      const resultAction = await dispatch(uploadChatFile(file));
      const fileData = (uploadChatFile.fulfilled.match(resultAction) && resultAction.payload) || null;
      if (fileData && fileData.file_presigned_url) {
        socket.emit("sendMessage", {
          sender: "Bot",
          file: true,
          content: fileData.file_name,
          threadId: selectedThreadId,
          createdAt: Date.now(),
          fileData: fileData,
        });
      }
    } catch (err) {
      console.error("File upload failed:", err);
    }
  };

  const isImage = (fileType?: string) => fileType?.startsWith("image/");
  const isDocument = (fileType?: string) => fileType && !fileType.startsWith("image/");

  const mappedAgents = (agents || []).map(agent => ({
    ...agent,
    profilePicture: typeof agent.profilePicture === 'string' ? agent.profilePicture : undefined,
  }));

  const handleOpenAssignPopover = (event: React.MouseEvent<HTMLElement>) => {
    setAssignAnchorEl(event.currentTarget);
    setAssignPopoverOpen(true);
  };
  const handleCloseAssignPopover = () => {
    setAssignPopoverOpen(false);
    setAssignAnchorEl(null);
  };
  const handleAssignAgent = (agentId: string) => {
    if (!selectedThreadId) return;
    setAssignedValue(agentId);
    dispatch(assignThread({ id: selectedThreadId, assignedTo: agentId }))
    .unwrap()
    .then((res) => {
      if (res) {
        toast.success("Thread assigned successfully");
      }
    })
    .catch((error: any) => {
      console.error("Error assigning thread:", error);
      toast.error(error || "Failed to assign thread");
      setAssignedValue(threadInfo?.assignedTo || ""); 
    });
    handleCloseAssignPopover();
  };

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
           
            <InfoDetail>
              <CloseConvButton onClick={onClose}>
                Close Conversation
              </CloseConvButton>
              <MoreDetailVerticalIcon color="primary" onClick={handleMoreDetailClick}>
                <MoreVertIcon/>
              </MoreDetailVerticalIcon>
              <MoreInfoIconDetail color="primary" >
                <InfoIcon />
              </MoreInfoIconDetail>
              <Popover
                id={id}
                open={openMoreDetail}
                anchorEl={moreDetailAnchorEl}
                onClose={handleMoreDetailClose}
                anchorOrigin={{
                  vertical: 'bottom',
                  horizontal: 'right',
                }}
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                PaperProps={{
                  sx: { p: 2, borderRadius: 1, boxShadow: 3 , marginTop: 1},
                }}
                >
                  {MoreOptions && MoreOptions.map((option)=>{
                    return(
                      <OptionSelect>
                        {option.icon}
                        {option.message}
                      </OptionSelect>
                    )
                  })}
              </Popover>
            </InfoDetail>
          </ChatHeader>
            <AgentsListDropDown >
                <Typography sx={{ color: '#252525', fontWeight: 700, fontFamily: "var(--custom-font-family)",}}>
                  Owner
                </Typography>
                <Box sx={{display:'flex', alignItems:'center' , gap:'10px'}}>
                <Avatar sx={{color:"#ababab", bgcolor:"#d2d2d26b"}} src={typeof assignedAgent?.profilePicture === 'string' ? assignedAgent?.profilePicture : undefined}>
                {typeof assignedAgent?.profilePicture === 'string' ? null : <PersonIcon />}
                </Avatar>
                <Typography sx={{ color: '#4b667f', textAlign:'end', fontWeight: 700, cursor:'pointer'}} onClick={handleOpenAssignPopover}>
                  {agents?.find(agent => agent.id === assignedValue)?.fullName || 'User'}
                </Typography>
                </Box>
            </AgentsListDropDown>
            <AssignedDropDown
              open={assignPopoverOpen}
              anchorEl={assignAnchorEl}
              onClose={handleCloseAssignPopover}
              agents={mappedAgents}
              assignedTo={assignedValue}
              onAssign={handleAssignAgent}
            />
          <ChatMessages id="chatMessagesContainer">
            {isTicketCreated && (
              <Box sx={{
                background: '#fffbe6',
                border: '1px solid #ffe58f',
                color: '#ad8b00',
                borderRadius: '8px',
                padding: '12px',
                margin: '12px 0',
                textAlign: 'center',
                fontWeight: 500,
                fontFamily: 'var(--custom-font-family)'
              }}>
                The chat is no longer active for messaging.<br />
                A support ticket has been created for follow-up.
              </Box>
            )}
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
                  const hasFile = !!chat.fileUrl;
                  const isImg = isImage(chat.fileType);
                  const isDoc = isDocument(chat.fileType);
                  const bubbleContent = (
                    <>
                      {hasFile && isImg && (
                                <>
                                <img
                                  src={chat.fileUrl!}
                                  alt={chat.fileName || "image"}
                                  style={{
                                    maxWidth: 220,
                                    maxHeight: 160,
                                    borderRadius: 18,
                                    boxShadow: "0 2px 8px rgba(0,0,0,0.10)",
                                    display: "block",
                                  }}
                                  onClick={() => setOpenImage(chat.fileUrl ?? null)}
                                />
                                <Modal open={!!openImage} onClose={() => setOpenImage(null)}>
                                  <Box
                                    sx={{
                                      display: "flex",
                                      alignItems: "center",
                                      justifyContent: "center",
                                      height: "100vh",
                                      bgcolor: "rgba(0,0,0,0.8)",
                                    }}
                                    onClick={() => setOpenImage(null)}
                                  >
                                    <img
                                      src={openImage || ""}
                                      alt="Full"
                                      style={{
                                        maxWidth: "90vw",
                                        maxHeight: "90vh",
                                        borderRadius: 18,
                                        boxShadow: "0 4px 24px rgba(0,0,0,0.3)",
                                        cursor: "pointer",
                                      }}
                                      onClick={e => e.stopPropagation()}
                                    />
                                  </Box>
                                </Modal>
                              </>
                            )}
                      {hasFile && isDoc && (
                              <Box
                                sx={{
                                  display: "flex",
                                  alignItems: "center",
                                  justifyContent: "space-between",
                                  bgcolor: "#f5f5f5",
                                  borderRadius: 3,
                                  p: 1.5,
                                  mb: 1,
                                  boxShadow: 1,
                                  minWidth: 220,
                                  maxWidth: 340,
                                  border: "4px solid var(--theme-color)",
                                }}
                              >
                                <InsertDriveFileIcon sx={{ color: "#388e3c", fontSize: 32, mr: 1 }} />
                                <a
                                  href={chat.fileUrl!}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  style={{
                                    color: "#222",
                                    textDecoration: "none",
                                    fontWeight: 600,
                                    fontSize: 16,
                                    flex: 1,
                                    margin: "0 8px",
                                    overflow: "hidden",
                                    textOverflow: "ellipsis",
                                    whiteSpace: "nowrap",
                                  }}
                                  title={chat.fileName}
                                >
                                  {chat.fileName || "Document"}
                                </a>
                                <IconButton
                                  href={chat.fileUrl!}
                                  download
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  sx={{
                                    bgcolor: "transparent",
                                    border: "2px solid var(--theme-color)",
                                    color: "var(--theme-color)",
                                    borderRadius: "50%",
                                    p: 0.5,
                                    ml: 1,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    "&:hover": { bgcolor: "#e0d3b8" }
                                  }}
                                  size="small"
                                >
                                  <DownloadIcon sx={{ color: "var(--theme-color)" }} />
                                </IconButton>
                              </Box>
                            )}
                      {chat.content && !hasFile && !(
                        chat.content === chat.fileName ||
                        chat.content.startsWith("File Uploaded:")
                      ) && (
                        <Box>
                          {chat.content}
                        </Box>
                      )}
                    </>
                  );
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
                          {(hasFile || (chat.content && !hasFile)) && (
                            <BotMessageBubble>
                              {bubbleContent}
                            </BotMessageBubble>
                          )}
                        </BotMessage>
                      ) : (
                        <UserMessage>
                          <TimeStamp>
                            {chat.sender} • {formatTimestamp(chat.createdAt)}
                          </TimeStamp>
                          {(hasFile || (chat.content && !hasFile)) && (
                            <UserMessageBubble>
                              {bubbleContent}
                            </UserMessageBubble>
                          )}
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
                  <>
                    <IconButton onClick={handleEmojiClick} size="small" disabled={isTicketCreated}>
                      <InsertEmoticonIcon />
                    </IconButton>
                    <Popover
                      open={showEmojiPicker}
                      anchorEl={anchorEl}
                      onClose={() => { setShowEmojiPicker(false); setAnchorEl(null); }}
                      anchorOrigin={{ vertical: 'top', horizontal: 'left' }}
                      transformOrigin={{ vertical: 'bottom', horizontal: 'left' }}
                    >
                      <EmojiPicker onEmojiClick={handleEmojiSelect} height={350} width={300} />
                    </Popover>
                    <IconButton component="label" tabIndex={-1} size="small" disabled={isTicketCreated}>
                      <AttachFileIcon />
                      <input
                        type="file"
                        hidden
                        onChange={handleFileChange}
                        accept="image/*,.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt"
                        disabled={isTicketCreated}
                      />
                    </IconButton>
                    <IconButton color="primary" onClick={sendMessage} disabled={!inputMessage.trim() || isTicketCreated}>
                      <Send size={20} />
                    </IconButton>
                  </>
                ),
              }}
              disabled={isTicketCreated}
            />
          </ChatInputContainer>
        </>
      )}
    </ChatContainer>
  );
}
