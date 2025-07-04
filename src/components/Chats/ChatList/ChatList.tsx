import React, { useEffect } from 'react';
import { ListItemAvatar, Avatar, ListItemText, Box, Typography, Divider ,Chip} from '@mui/material';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ChatListContainer,
  ChatListItem,
  ThreadList,
  TimeStamp,
  MessagePreview,
} from './chatList.styled';
import { useSocket } from '../../../context/SocketContext';
import { useDispatch } from 'react-redux';
import { readThread, Thread } from '../../../redux/slice/threadSlice';
import { AppDispatch } from '../../../redux/store/store';
import { formatTimestamp } from '../../../utils/utils';
import SearchComponent from '../../SearchBar/SearchComponent';
import { seenMessage } from '../../../redux/slice/chatSlice';

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

  const HandleUnreadedThreadSelect  = async(id:string)=>{
    if(id){
      
      dispatch(readThread({id})).then(()=>{
        console.log("readed")
        onSelectThread(id)
      }).catch((err)=>{
        console.log(err)
      })
    }else{
      return
    }
  }

  const handleReadedThreadSelect = async(id:string)=>{
    if(id){
      dispatch(seenMessage({id})).then(()=>{
        console.log("seen")
        onSelectThread(id)
      }).catch((err)=>{
        console.log(err)
      })
    }else{
      return
    }
  }

  useEffect(() => {
    if (!socket) return;

    const handleChatStarted = (data: { threadId: string }) => {
      console.log("New thread started with ID:", data.threadId);
      onSelectThread(data.threadId);
    };

    socket.on("chatStarted", handleChatStarted);
    return () => {
      socket.off("chatStarted", handleChatStarted);
    };
  }, [socket, dispatch, onSelectThread, type]);

  return (
    <ChatListContainer>
      <SearchComponent />
      <Divider />
      <Box sx={{ overflowY: 'auto', flex: 1,
       '&::-webkit-scrollbar': {
        display: 'none',
      },
      'msOverflowStyle': 'none',
      'scrollbarWidth': 'none',
       }}>
        {threads && threads.length > 0 ? (
          <AnimatePresence>
            <ThreadList>
              {threads.map((thread, index) => {
                const isActive = thread.id === selectedThreadId; // Correct active thread logic
                console.log(thread,"thread")
                if(!thread.readed){
                  return(
                     <MotionChatListItem
                    sx={{bgcolor:"var(--theme-color)"}}
                    key={thread.id}
                    active={isActive}
                    onClick={() => HandleUnreadedThreadSelect(thread.id)}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor: 'var(--theme-color-dark)', width: 32, height: 32 }}>
                        {thread.name[0]?.toUpperCase() || "U"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={((thread?.name ?? '').charAt(0).toUpperCase() + (thread?.name ?? '').slice(1)) || 'Unkown Visitor'}
                      secondary={<MessagePreview>{`${thread?.messages[0].content.substr(0,20)}...` || "Click to start a conversation"}</MessagePreview>}
                      primaryTypographyProps={{ variant: 'body1', fontSize: '0.9rem', fontFamily: 'var(--custom-font-family)' }}
                    />
                    <div style={{display:"flex",flexDirection:"column"}}>
                      <TimeStamp fontFamily={'var(--custom-font-family)'}>{formatTimestamp(thread.createdAt)}</TimeStamp>
                      {thread.unseenCount ?  <Chip label={thread?.unseenCount|| ""} color="success" size='small' sx={{marginLeft:"5px",width:"25px"}}/>:""}
                    </div>
                  </MotionChatListItem>
                  )
                }else{
                  return (
                  <MotionChatListItem
                  sx={{ bgcolor:`${thread.unseenCount?"var(--theme-color)":""}`}}
                    key={thread.id}
                    active={isActive}
                    onClick={() => handleReadedThreadSelect(thread.id)}
                    variants={listItemVariants}
                    initial="hidden"
                    animate="visible"
                    transition={{ delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                   
                    <ListItemAvatar>
                      <Avatar sx={{ bgcolor:`${thread.unseenCount?"var(--theme-color-dark)":""}`, width: 32, height: 32 }}>
                        {thread.name[0]?.toUpperCase() || "U"}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={((thread?.name ?? '').charAt(0).toUpperCase() + (thread?.name ?? '').slice(1)) || 'Unkown Visitor'}
                      secondary={<MessagePreview>{`${thread?.messages[0].content.substr(0,20)}...` || "Click to start a conversation"}</MessagePreview>}
                      primaryTypographyProps={{ variant: 'body1', fontSize: '0.9rem', fontFamily: 'var(--custom-font-family)' }}
                    />
                      <div style={{display:"flex",flexDirection:"column"}}>
                      <TimeStamp fontFamily={'var(--custom-font-family)'}>{formatTimestamp(thread.createdAt)}</TimeStamp>
                    {thread.unseenCount ?  <Chip label={thread?.unseenCount|| ""} color="success" size='small' sx={{marginLeft:"5px",width:"25px"}}/>:""}
                    </div>
                  </MotionChatListItem>
                );
                }
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
            <Typography variant="body1" fontFamily={'var(--custom-font-family)'}>No threads available</Typography>
          </Box>
        )}
      </Box>
    </ChatListContainer>
  );
};

export default ChatList;
