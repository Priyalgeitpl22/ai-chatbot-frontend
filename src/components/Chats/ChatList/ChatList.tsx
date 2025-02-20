import React, { useEffect } from 'react';
import { ListItemAvatar, Avatar, ListItemText, Box, Typography, Divider } from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChatListContainer,
  ChatListItem,
  ThreadList,
  TimeStamp,
  MessagePreview,
  SearchBar,
} from './chatList.styled';
import { useSocket } from '../../../context/SocketContext';
import { useDispatch } from 'react-redux';
import { getAllThreads, Thread } from '../../../redux/slice/threadSlice';
import { AppDispatch } from '../../../redux/store/store';
import { formatTimestamp } from '../../../utils/utils';
import { Search } from 'lucide-react';

const listItemVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { opacity: 1, x: 0 },
};

interface ChatListProps {
  threads: Thread[];
  onSelectThread: (threadId: string) => void;
  type: string;
  selectedThreadId: string | null;
}

const MotionChatListItem = motion(ChatListItem);

const ChatList: React.FC<ChatListProps> = ({ threads, onSelectThread, type, selectedThreadId }) => {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    if (!socket) return;

    const handleChatStarted = (data: { threadId: string }) => {
      console.log("New thread started with ID:", data.threadId);
      dispatch(getAllThreads());
      onSelectThread(data.threadId);
    };

    socket.on("chatStarted", handleChatStarted);
    return () => {
      socket.off("chatStarted", handleChatStarted);
    };
  }, [socket, dispatch, onSelectThread, type]);

  return (
    <ChatListContainer>
      <SearchBar>
        <Search size={20} color="#64748b" />
        <input placeholder="Search conversations..." />
      </SearchBar>
      <Divider />
      <Box sx={{ overflowY: 'auto', flex: 1 }}>
        {threads && threads.length > 0 ? (
          <AnimatePresence>
            <ThreadList>
              {threads.map((thread, index) => {
                const isActive = thread.id === selectedThreadId; // Correct active thread logic

                return (
                  <MotionChatListItem
                    key={thread.id}
                    active={isActive}
                    onClick={() => onSelectThread(thread.id)}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'var(--theme-color)', width: 32, height: 32 }}>
                        {thread.type[0]?.toUpperCase() || "?"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary="Unknown Visitor"
                      secondary={<MessagePreview>Click to view messages</MessagePreview>}
                      primaryTypographyProps={{ variant: 'body1', fontSize: '0.9rem' }}
                    />
                    <TimeStamp>{formatTimestamp(thread.createdAt)}</TimeStamp>
                  </MotionChatListItem>
                );
              })}
            </ThreadList>
          </AnimatePresence>
        ) : (
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '100%',
            }}
          >
            <Typography variant="body1">No threads available</Typography>
          </Box>
        )}
      </Box>
    </ChatListContainer>
  );
};

export default ChatList;
