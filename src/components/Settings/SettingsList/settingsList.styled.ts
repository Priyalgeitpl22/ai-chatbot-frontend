import { Box, styled } from '@mui/system';
import { ListItemButton } from "@mui/material";

export const SettingsListContainer = styled(Box)`
  display: flex;
  flex-direction: column;
  height: 100%;
  min-width: 260px;
  background-color: #fff;
  border-right: 1px solid #ddd;
`;

export const SettingsListHeader = styled(Box)`
  padding: 16px;
  font-weight: bold;
  text-align: center;
  border-bottom: 1px solid #ddd;
`;

export const StyledIconBox = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  min-width: 32px;
`;

export const StyledListItemButton = styled(ListItemButton)`
  margin-bottom: 8px;
    color: #64748b;
  transition: all 0.3s ease-in-out;
  .MuiListItemIcon-root,
  .MuiListItemText-primary {
    transition: color 0.3s ease-in-out;
  }
   .MuiTypography-root {
    font-family: var(--custom-font-family);
  }
  &:hover {
    transform: scale(1.01);
    background-color: #e0e0e0;
  }

  &.Mui-selected {
    background-color: var(--theme-color);
    color: #1e293b;

    &:hover {
      background-color: var(--theme-color);
      transform: scale(1.005);
    }
  }
`;
