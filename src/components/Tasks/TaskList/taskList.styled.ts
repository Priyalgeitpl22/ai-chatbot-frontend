import { ListItem, Box } from '@mui/material';
import { styled } from '@mui/system';

export const TaskListContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  width: auto;
  background-color: #f9f9f9;
  border-right: 1px solid #ddd;
`;

export const TaskListHeader = styled(Box)`
  padding: 16px;
  background: var(--theme-color, #1976d2);
  color: white;
  font-weight: bold;
  text-align: center;
  box-shadow: 0px 2px 4px rgba(0, 0, 0, 0.1);
`;

export const TaskListWrapper = styled(Box)`
  display: flex;
  flex-direction: column;
  padding: 8px;
  gap: 8px;
`;

export const TaskListItem = styled(ListItem)<{ active: boolean }>`
  display: flex;
  align-items: center;
  padding: 10px;
  border-radius: 8px;
  background: ${({ active }) => (active ? '#e3f2fd' : '#fff')};
  border: ${({ active }) => (active ? '1px solid #1976d2' : '1px solid #ddd')};
  cursor: pointer;
  transition: background 0.3s, transform 0.2s;
  &:hover {
    background: #f1f8ff;
    transform: scale(1.02);
  }
`;

export const TimeStamp = styled(Box)`
  font-size: 0.75rem;
  color: #888;
  margin-left: auto;
`;

export const TaskPreview = styled(Box)`
  font-size: 0.85rem;
  color: #666;
  font-weight: 500;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  width: 100%;
  width: 25ch;
`;

