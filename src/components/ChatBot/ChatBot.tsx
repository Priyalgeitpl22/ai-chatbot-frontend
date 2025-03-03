import { useState } from 'react';
import { Box, IconButton, Typography } from '@mui/material';
import { Send, AttachFile, InsertEmoticon, Chat } from '@mui/icons-material';
import { ChevronDown } from 'lucide-react';
import {
  ChatContainer,
  Header,
  Logo,
  ChatBody,
  Message,
  InputContainer,
  StyledTextField,
  OpenButton,
  DropdownIconButton
} from './chatBot.styled';

function ChatBot({ settings }: any) {
  const [message, setMessage] = useState('');
  const [isOpen, setIsOpen] = useState(true);

  const handleMenuClick = () => {
    setIsOpen(false);
  };

  return (
    <Box sx={{
      display: 'flex',
      justifyContent: 'center',
    }}>
      {isOpen ? (
        <ChatContainer>
          <Header bgcolor={settings.iconColor}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Logo src="https://img.freepik.com/premium-psd/robot-isolated-png-with-transparent-background_68880-68988.jpg" alt="Logo" />
              <Typography style={{ display: "flex", flexDirection:'column' }}>
                <span>ChatBot</span>
                <span style={{fontSize:'10px'}}>{settings?.availability ? "Online" : "Offline"}</span>
              </Typography>
            </div>
            <DropdownIconButton onClick={handleMenuClick}>
              <ChevronDown />
            </DropdownIconButton>
          </Header>

          <ChatBody bgcolor={settings.chatWindowColor}>
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Message style={{ backgroundColor: '#e9ecef' }} color={settings.fontColor}>
                Hello! How can I help you?
              </Message>
              <span style={{ fontSize: '10px', color: '#6b7280', marginBlock: '0.5rem' }}>10:30 AM</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end' }}>
              <Message style={{ backgroundColor: settings.iconColor, color: '#fff' }}>
                I need assistance with my order.
              </Message>
              <span style={{ fontSize: '10px', color: '#6b7280', marginBlock: '0.5rem' }}>10:31 AM</span>
            </div>
          </ChatBody>

          <InputContainer>
            <StyledTextField
              fullWidth
              variant="outlined"
              placeholder="Type a message..."
              size="small"
              value={message}
              onChange={(e: any) => setMessage(e.target.value)}
              InputProps={{
                endAdornment: (
                  <>
                    {settings.allowEmojis && (
                      <>
                        <IconButton sx={{ padding: '3px' }} >
                          <InsertEmoticon />
                        </IconButton>
                      </>
                    )}

                    {settings.allowFileUpload && (
                      <IconButton sx={{ padding: '3px' }} component="label">
                        <AttachFile />
                      </IconButton>
                    )}

                    <IconButton sx={{ padding: '3px' }}>
                      <Send />
                    </IconButton>
                  </>
                ),
              }}
            />
          </InputContainer>
        </ChatContainer>
      ) : (
        <OpenButton bgcolor={settings.iconColor} onClick={() => setIsOpen(true)}>
          <Chat />
        </OpenButton>
      )}
    </Box>
  );
}

export default ChatBot;
