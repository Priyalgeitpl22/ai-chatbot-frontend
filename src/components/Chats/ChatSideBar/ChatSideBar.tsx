import { ListItemText, ListItemIcon, Typography, Box, Divider } from "@mui/material";
import { MessageCircle, Users, Bot, UserCheck, MessageSquare } from "lucide-react";
import { SidebarContainer, Count, ChatList, SidebarItem } from "./chatSidebar.styled";
import { useSelector } from "react-redux";
import { RootState } from "../../../redux/store/store";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trash2 } from "lucide-react";
import { MessageSquareDot } from "lucide-react";
interface MenuItem {
  text: string;
  icon: JSX.Element;
  count?: number;
  threadType: string;
}
const MotionSidebarItem = motion.create(SidebarItem);
interface ChatSideBarProps {
  selectedType: string;
  onSelectType: (type: string) => void;
}
const ChatSideBar = ({ selectedType, onSelectType }: ChatSideBarProps) => {
  const threadsState = useSelector((state: RootState) => state.thread);
  const { user } = useSelector((state: RootState) => state.user);
  const [threadCounts, setThreadCounts] = useState<Record<string, number>>({});
  useEffect(() => {
    const groupedCounts = threadsState.threads.reduce(
      (acc: Record<string, number>, thread: { type: string; assignedTo?: string | null }) => {
        // For "assigned" type, only count threads assigned to the current user
        if (thread.type === "assigned") {
          if (thread.assignedTo === user?.id) {
            acc[thread.type] = (acc[thread.type] || 0) + 1;
          }
        } else {
          // For other types, count all threads of that type
          acc[thread.type] = (acc[thread.type] || 0) + 1;
        }
        return acc;
      },
      {}
    );
    groupedCounts["open"] = threadsState.threads.length;    
    setThreadCounts(groupedCounts);
  }, [threadsState.threads, user?.id]);
  const menuItems: MenuItem[] = [
    { text: "Unassigned", icon: <Users size={20} />, count: threadCounts["unassigned"] || 0, threadType: "unassigned" },
    { text: "Assigned to me", icon: <UserCheck size={20} />, count: threadCounts["assigned"] || 0, threadType: "assigned" },
    { text: "Open Chats", icon: <MessageSquare size={20} />, count: threadCounts["open"] || 0, threadType: "open" },
    { text: "Chat", icon: <MessageCircle size={20} />, count: threadCounts["chat"] || 0, threadType: "chat" },
    { text: "Completed Chats", icon: <MessageSquareDot size={20} />, count: threadCounts["completed"] || 0, threadType: "completed"},
    { text: "Bots", icon: <Bot size={20} />, count: threadCounts["bots"] || 0, threadType: "bots" },
    { text: "Trashed Chats", icon: <Trash2 size={20} />, count: threadCounts["trash"] || 0, threadType: "trash" },
  ];
  return (
    <SidebarContainer>
      <Box sx={{ padding: "10px", borderRadius: "8px" }} display="flex" alignItems="center" flexDirection="column">
        <Typography variant="h6" sx={{ fontFamily: "var(--custom-font-family)", fontWeight: 600, color:"#1E293B" }}>
          Inbox
        </Typography>
      </Box>
      <Divider />
      <ChatList>
        {menuItems.map((item) => {
          const hasThreads = threadsState.threads && threadsState.threads.length > 0;
          const isActive = hasThreads ? selectedType === item.threadType : false;
          return (
            <MotionSidebarItem
              key={item.text}
              active={isActive}
              onClick={() => onSelectType(item.threadType)}
              whileTap={{ scale: 0.98 }}
            >
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text}
              primaryTypographyProps={{ variant: 'body1', fontSize: '0.9rem', fontFamily: 'var(--custom-font-family)' }}
              />
              {typeof item.count === "number" && <Count variant="body2" fontFamily={'var(--custom-font-family)'}>{item.count}</Count>}
            </MotionSidebarItem>
          );
        })}
      </ChatList>
    </SidebarContainer>
  );
};
export default ChatSideBar;