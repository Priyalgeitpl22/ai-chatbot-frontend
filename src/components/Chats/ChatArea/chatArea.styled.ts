import { styled } from '@mui/material/styles';
import { Box, Typography, Button } from '@mui/material';

export const ChatContainer = styled(Box)({
  flex: 1,
  display: 'flex',
  flexDirection: 'column',
  height: '100%',
  backgroundColor: '#fff',
});

export const ChatHeader = styled(Box)({
  padding: '12px',
  borderBottom: '1px solid #e0e0e0',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  fontFamily: 'Times New Roman',
});

export const ChatMessages = styled(Box)({
  flex: 1,
  overflowY: 'auto',
  padding: '20px',
  '&::-webkit-scrollbar': {
    display: 'none',
  },
  msOverflowStyle: 'none',
  scrollbarWidth: 'none',
  fontFamily: 'Times New Roman',
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
  fontFamily: 'Times New Roman',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontFamily: 'Times New Roman',
    padding: '10px',
    backgroundColor: '#f1f1f1',
    '& fieldset': {
      borderColor: 'transparent',
    },
    '&:hover fieldset': {
      borderColor: '#ccc',
    },
    '&.Mui-focused fieldset': {
      borderColor: 'var(--theme-color-dark)',
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
  height: '-webkit-fill-available',
  textAlign: 'center',
  background: '#ffff'
});

export const BotMessage = styled(Box)({
  display: 'flex',
  flexDirection:'column',
  alignItems:'flex-end',
  gap: '8px',
  marginBottom: '24px',
  fontFamily: 'Times New Roman',
});

export const BotMessageBubble = styled(Box)({
  backgroundColor: 'var(--theme-color)',
  color: 'black',
  padding: '12px 16px',
  borderRadius: '12px',
  wordWrap: 'break-word',
  maxWidth:'80%',
  fontFamily: 'Times New Roman',
});

export const UserMessage = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '8px',
  fontFamily: 'Times New Roman',
});

export const UserMessageBubble = styled(Box)({
  backgroundColor: '#e9ecef',
  color: '#000000',
  padding: '12px',
  borderRadius: '12px',
  maxWidth: '80%',
  wordWrap: 'break-word',
  fontFamily: 'Times New Roman',
});