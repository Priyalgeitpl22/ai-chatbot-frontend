import { styled } from '@mui/material/styles';
import { Box, Typography, Button, MenuItem } from '@mui/material';

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
  fontFamily: 'var(--custom-font-family)',
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
  fontFamily: 'var(--custom-font-family)',
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
  fontFamily: 'var(--custom-font-family)',
  '& .MuiOutlinedInput-root': {
    borderRadius: '10px',
    fontFamily: 'var(--custom-font-family)',
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
  fontFamily: 'var(--custom-font-family)',
});

export const BotMessageBubble = styled(Box)({
  backgroundColor: 'var(--theme-color)',
  color: 'black',
  padding: '12px 16px',
  borderRadius: '12px',
  wordWrap: 'break-word',
  maxWidth:'80%',
  fontFamily: 'var(--custom-font-family)',
});

export const UserMessage = styled(Box)({
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'flex-start',
  alignItems: 'flex-start',
  gap: '8px',
  fontFamily: 'var(--custom-font-family)',
});

export const UserMessageBubble = styled(Box)({
  backgroundColor: '#e9ecef',
  color: '#000000',
  padding: '12px',
  borderRadius: '12px',
  maxWidth: '80%',
  wordWrap: 'break-word',
  fontFamily: 'var(--custom-font-family)',
});
export const OptionSelect = styled(MenuItem)({
  width:"17rem",
  display:"flex",
  gap:"1rem",
  cursor:"pointer",
  height:"3rem",
   "&.Mui-selected": {
    backgroundColor: "#f5f5f5",
  },
  "&.Mui-selected:hover": {
    
    backgroundColor: "#e0e0e0",
  },
})

export const AgentsListDropDown = styled(Box)({
  fontFamily: "var(--custom-font-family)", 
  fontSize: "1rem",
  display: 'flex', 
  flexDirection:'column',
  gap: '2px', 
  padding:'5px 10px',
  boxShadow:'0px 1px 0px #ababab',
})

export const InfoDetail = styled(Box)({
  fontFamily: "var(--custom-font-family)", 
  fontSize: "1rem", 
  color: "#35495c", 
  display: 'flex', 
  alignItems: 'center', 
  gap: '2px',
})

export const CloseConvButton = styled(Button)({
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '14px',
  color: '#35495c',
  fontFamily: 'var(--custom-font-family)',
  padding: '6px 12px',
  borderRadius: '4px',
  backgroundColor: '#f5f8fa',
  border: '1px solid #dce3e8',
  '&:hover': {
    backgroundColor: '#e6eff5',
  },
})

export const MoreDetailVerticalIcon = styled(Button)({
  minWidth: 0,
  padding: 6,
  borderRadius: 8,
  color: '#35495c',
  backgroundColor: 'transparent',
})

export const MoreInfoIconDetail = styled(MoreDetailVerticalIcon)();