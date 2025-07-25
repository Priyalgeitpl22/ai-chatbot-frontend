import { Badge, ListItem, Typography, ListItemButton, List, TextField } from '@mui/material';
import { styled } from '@mui/material/styles';

export const StatusBadge = styled(Badge)<{ online: boolean }>(({ theme, online }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: online ? '#4caf50' : '#f44336',
    color: online ? '#4caf50' : '#f44336',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
    borderRadius: '50%',
    height: 8,
    width: 8,
    minWidth: 0,
  },
}));

export const SearchTextField = styled(TextField)({
  marginBottom: '16px',
  fontFamily: 'var(--custom-font-family)',
});

export const SectionTitle = styled(Typography)({
  marginBottom: '8px',
  color: '#888',
  fontWeight: 600,
  fontFamily: 'var(--custom-font-family)',
});

export const StyledAssignedItem = styled(ListItem)({
  padding: '8px',
  marginBottom: '8px',
  borderRadius: '16px',
  backgroundColor: '#f5f5f5',
});

export const AgentStatusText = styled('span')({
  color: '#898989',
  fontSize: 12,
});

export const AgentName = styled('span')({
  fontWeight: 700,
  fontFamily: 'var(--custom-font-family)',
});

export const StyledListItemButton = styled(ListItemButton)<{ isOnline: boolean }>(({ isOnline }) => ({
  borderRadius: 16,
  marginBottom: 4,
  opacity: isOnline ? 1 : 0.5,
  cursor: isOnline ? 'pointer' : 'not-allowed',
  '&.Mui-selected': {
    background: 'var(--theme-color)',
    color: '#fff',
  },
}));

export const ScrollableAgentList = styled(List)({
  maxHeight: 300,
  overflowY: 'auto',
  padding: 0,
});

export const NoAgentsFoundText = styled(Typography)({
  color: '#aaa',
  textAlign: 'center',
  paddingTop: '16px',
  paddingBottom: '16px',
});
