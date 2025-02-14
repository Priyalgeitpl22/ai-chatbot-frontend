import { List, ListItemText, ListItemIcon, Typography, Box, Divider, Switch } from "@mui/material";
import { MessageCircle, Users, Bot, UserCheck, MessageSquare } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { SidebarContainer, StatusIndicator, SidebarItem, ActiveIndicator, CountBadge, Count } from "./chatSidebar.styled";
import { useState } from "react";

interface MenuItem {
  text: string;
  icon: JSX.Element;
  count?: number;
  threadType: string;
}

const menuItems: MenuItem[] = [
  { text: "Unassigned", icon: <Users size={20} />, count: 3, threadType: "unassigned" },
  { text: "Assigned to me", icon: <UserCheck size={20} />, count: 1, threadType: "assigned" },
  { text: "All open", icon: <MessageSquare size={20} />, count: 4, threadType: "open" },
  { text: "Chat", icon: <MessageCircle size={20} />, count: 4, threadType: "chat" },
  { text: "Bots", icon: <Bot size={20} />, count: 3, threadType: "bots" },
];

const MotionSidebarItem = motion.create(SidebarItem);

interface ChatSideBarProps {
  selectedType: string;
}

const ChatSideBar = ({ selectedType }: ChatSideBarProps) => {
  const navigate = useNavigate();

  return (
    <SidebarContainer>
      <Box sx={{ padding: "16px" }} display="flex" alignItems="center" flexDirection={"column"}>
        <Typography variant="h6" sx={{ fontFamily: "cursive", fontWeight: 600 }}>
          Inbox
        </Typography>
      </Box>
      <Divider />
      <List>
        {menuItems.map((item) => {
          const isActive = selectedType === item.threadType;
          return (
            <MotionSidebarItem
              key={item.text}
              active={isActive}
              onClick={() => navigate(`/chats/${item.threadType}`)}
              whileTap={{ scale: 0.98 }}
            >
              {isActive && (
                <ActiveIndicator
                  layoutId="activeIndicator"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                />
              )}
              <ListItemIcon sx={{ minWidth: 40 }}>{item.icon}</ListItemIcon>
              <ListItemText primary={item.text} />
              {/* <CountBadge> */}
              {typeof item.count === "number" && <Count variant="body2">{item.count}</Count>}
              {/* </CountBadge> */}
            </MotionSidebarItem>
          );
        })}
      </List>
    </SidebarContainer>
  );
};

export default ChatSideBar;
