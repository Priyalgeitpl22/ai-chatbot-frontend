import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

export const ChatContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '600px',
  backgroundColor: '#fff',
});

export const ChatHeader = styled(Box)({
  padding: '12px',
  borderBottom: '1px solid #e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  backgroundColor: '#7ed8d6',
});

export const ChatMessages = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
});

export const ReassignmentNote = styled(Typography)({
  color: '#757575',
  fontSize: '0.875rem',
  textAlign: 'center',
  margin: '16px 0',
  padding: '8px',
  backgroundColor: '#fafafa',
  borderRadius: '8px',
});

export const ChatInputContainer = styled(Box)({
  padding: '16px',
  backgroundColor: '#fff',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    padding: '10px',
    backgroundColor: '#f1f1f1',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: '#ccc',
    },
    '&.Mui-focused fieldset': {
      borderColor: '#1976d2',
    },
  },
});

export const QuickReplyButton = styled(Button)({
  marginRight: '8px',
  marginBottom: '8px',
  borderColor: '#e0e0e0',
  color: '#000',
});

export const PlaceholderContainer = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  textAlign: 'center',
});

export const BotMessage = styled(Box)({
  display: 'flex',
  flexDirection:'column',
  alignItems:'flex-end',
  gap: '8px',
  marginBottom: '24px',
  
});

export const BotMessageBubble = styled(Box)({
  backgroundColor: '#7ed8d7',
  color: '#ffffff',
  padding: '12px 16px',
  borderRadius: '12px',
  wordWrap: 'break-word',
  maxWidth:'80%',
});

export const UserMessage = styled(Box)({
  display: 'flex',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '8px',
  marginBottom: '24px',
});

// User Message Bubble
export const UserMessageBubble = styled(Box)({
  backgroundColor: '#e9ecef',
  color: '#000000',
  padding: '12px 16px',
  borderRadius: '12px',
  maxWidth: '80%',
  wordWrap: 'break-word',
});