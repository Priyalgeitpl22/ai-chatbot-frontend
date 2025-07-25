import React from "react";
import { Avatar, Chip, ListItemAvatar, ListItemText } from "@mui/material";
import { motion } from "framer-motion";
import { ChatListItem, TimeStamp, MessagePreview } from './chatList.styled';
import { formatTimestamp } from "../../../utils/utils";
import { Thread } from "../../../redux/slice/threadSlice";
import ChatSummaryTooltip from './ChatSummaryTooltip'
import Tooltip from "@mui/material/Tooltip";
import { Info } from "lucide-react";

const MotionChatListItem = motion(ChatListItem);

interface ChatThreadItemProps {
  thread: Thread; 
  index: number;
  isActive: boolean;
  onClick: () => void;
}
const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

const ChatThreadItem: React.FC<ChatThreadItemProps> = ({ thread, index, isActive, onClick }) => {
  const isUnread = !thread.readed;
  const hasUnseen = !!thread.unseenCount;

  const bgColor = isUnread ? "var(--theme-color)" : hasUnseen ? "var(--theme-color)" : "";
  const avatarColor = isUnread ? "var(--theme-color-dark)" : hasUnseen ? "var(--theme-color-dark)" : "";

    return (
      <MotionChatListItem
        sx={{ bgcolor: bgColor }}
        key={thread.id}
        active={isActive}
        onClick={() => onClick()}
        variants={listItemVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: index * 0.1 }}
        whileTap={{ scale: 0.98 }}
      >
        <ListItemAvatar>
          <Avatar sx={{ bgcolor: avatarColor, width: 32, height: 32 }}>
            {thread.name[0]?.toUpperCase() || "U"}
          </Avatar>
        </ListItemAvatar>
        <ListItemText
          primary={((thread?.name ?? '').charAt(0).toUpperCase() + (thread?.name ?? '').slice(1)) || 'Unknown Visitor'}
          secondary={<MessagePreview>{thread?.latestMessage?.content?.substr(0, 20) ? `${thread.latestMessage.content.substr(0, 20)}...` : "Click to start a conversation"}</MessagePreview>}
          primaryTypographyProps={{ variant: 'body1', fontSize: '0.9rem', fontFamily: 'var(--custom-font-family)' }}
        />
        <div style={{ display: "flex", flexDirection: "column", alignItems: "flex-end" }}>
          <TimeStamp fontFamily={'var(--custom-font-family)'}>{formatTimestamp(thread.createdAt)}</TimeStamp>
          <div style={{ display: "flex", flexDirection: "row", alignItems: "center", marginTop: 2 ,gap: 5}}>
            {thread.unseenCount ? (
              <Chip
                label={thread?.unseenCount || ""}
                color="success"
                size="small"
                sx={{ marginLeft: "0px", width: "25px" }}
              />
            ) : null}
            {thread?.status === 'ended' && (
              <Tooltip
                title={<ChatSummaryTooltip threadId={thread.id} hoverMode />}
                placement="top"
                arrow
                componentsProps={{
                  tooltip: {
                    sx: {
                      bgcolor: "#fff",
                      color: "#000",
                      boxShadow: 2,
                      border: "1px solid #e0e0e0",
                      fontSize: "0.85rem",
                      padding: "8px 12px",
                      borderRadius: "6px",
                      maxWidth: 350,
                    },
                  },
                  arrow: { sx: { color: "#fff" } },
                }}
              >
                <Info size={20} color="#074ea0ff" style={{ marginTop: "4px", cursor: "pointer" }} />
              </Tooltip>
            )}
          </div>
        </div>
      </MotionChatListItem>
    );
};

export default React.memo(ChatThreadItem);
