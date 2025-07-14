import React, { useEffect } from 'react';
import {   Box, Typography, Divider } from '@mui/material';
import { AnimatePresence } from 'framer-motion';
import {
  ChatListContainer,
  ThreadList,
} from './chatList.styled';
import { useSocket } from '../../../context/SocketContext';
import { useDispatch, useSelector } from 'react-redux';
import { addThread, readThread, Thread,newMessage ,readThreads} from '../../../redux/slice/threadSlice';
import { AppDispatch, RootState } from '../../../redux/store/store';
import SearchComponent from '../../SearchBar/SearchComponent';
import { seenMessage } from '../../../redux/slice/chatSlice';
import ChatThreadItem from './chatThreadItem';


interface ChatListProps {
  threads: Thread[];
  onSelectThread: (threadId: string) => void;
  type: string;
  selectedThreadId: string | null;
}



const ChatList: React.FC<ChatListProps> = ({ threads, onSelectThread, type, selectedThreadId }) => {
  const { socket } = useSocket();
  const dispatch = useDispatch<AppDispatch>();
  const {user} = useSelector((state:RootState)=>state.user)

  const HandleUnreadedThreadSelect = async (id: string) => {
    if (id) {

      dispatch(readThread({ id })).then(() => {
        onSelectThread(id)
        socket?.emit("threadSeen",{id,orgId:user?.orgId})
      }).catch((err) => {
        console.log(err)
      })
    } else {
      return
    }
  }

  const handleReadedThreadSelect = async (id: string) => {
    if (id) {
      dispatch(seenMessage({ id })).then(() => {
        onSelectThread(id)
      }).catch((err) => {
        console.log(err)
      })
    } else {
      return
    }
  }

  useEffect(() => {
    if (!socket) return;

    const handleChatStarted = (data: { thread: Thread }) => {
      dispatch(addThread(data.thread))
    };

    const handleNewMessage = (data:any)=>{
      const payload={
        count:1,
        latestMessage:data.data.content,
        threadId:data.data.threadId
      }
      dispatch(newMessage(payload))
    }

     const handelSeen = (data:any)=>{
             if(!data)return;
             dispatch(readThreads(data.data.id))
            }
            socket.on("seenThread",handelSeen)
    socket.on("chatStarted", handleChatStarted);
    socket.on("newMessage",handleNewMessage);
    return () => {
      socket.off("chatStarted", handleChatStarted);
      socket.off("newMessage",handleNewMessage);
    };
  }, [socket, dispatch, onSelectThread, type]);

  return (
    <ChatListContainer>
      <SearchComponent />
      <Divider />
      <Box sx={{
        overflowY: 'auto', flex: 1,
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
                const isActive = thread.id == selectedThreadId; // Correct active thread logic
                const onClickHandler = thread.readed
                  ? () => handleReadedThreadSelect(thread.id)
                  : () => HandleUnreadedThreadSelect(thread.id);
                return (
                  <ChatThreadItem
                    key={thread.id}
                    thread={thread}
                    index={index}
                    isActive={isActive}
                    onClick={onClickHandler}
                  />
                )
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
