import { styled } from '@mui/material/styles';
import { Box, ListItem, List, Typography } from '@mui/material';
import { motion } from 'framer-motion';

interface SidebarItemProps {
  active?: boolean;
  online?: boolean
}

export const SidebarContainer = styled(Box)({
  width: 240,
  height: '95%',
  backgroundColor: '#ffffff',
  borderRight: '1px solid #e0e0e0', 
  overflowY: 'auto',
  padding: '10px',
  borderRadius: '10px'
});

export const StatusIndicator = styled("div", {
  shouldForwardProp: (prop) => prop !== "online",
})<SidebarItemProps>(({ online }) => ({
  width: 8,
  height: 8,
  borderRadius: "50%",
  backgroundColor: online ? "#4caf50" : "red",
}));

export const SidebarItem = styled(ListItem, {
  shouldForwardProp: (prop) => prop !== 'active',
})<SidebarItemProps>(({ active }) => ({
  '&:hover': {
    backgroundColor: 'var(--theme-color)',
    cursor: 'pointer',
  },
  backgroundColor: active ? 'var(--theme-color)' : 'transparent',
  position: 'relative',
  padding: '8px 16px',
  borderRadius: '8px',
}));

export const ActiveIndicator = styled(motion.div)({
  position: 'absolute',
  left: 0,
  top: 0,
  bottom: 0,
  width: 4,
  backgroundColor: 'var(--theme-color)', 
  borderRadius: '0 4px 4px 0',
});

export const Count = styled(Typography)(`
  marginLeft: 'auto';
  color: '#757575';
  background: var(--theme-color);
  border-radius: 12px;
  width: 18px;
  height: 24px;
  align-items: center;
  display: flex;
  justify-content: center;
`);

export const CountBadge = styled(motion.div)({
  color: '#757575', 
  backgroundColor: '#7dd1e3',
  width: '18px',
  height: '20px',
  borderRadius: '10px'
});

export const ChatContainer = styled(Box)`
  width: 100%;
  height: 98%;
  display: flex;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;
  flex-direction: row;
`;

export const ChatList = styled(List)`
    list-style: none;
    margin: 0;
    padding: 0;
    position: relative;
    padding-top: 8px;
    padding-bottom: 8px;
    gap: 5px;
    display: flex;
    flex-direction: column;
`