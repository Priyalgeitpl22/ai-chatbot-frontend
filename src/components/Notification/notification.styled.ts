import styled from "@emotion/styled";
import { Box, Button, ListItemAvatar, Typography} from "@mui/material";

export const NotificationContainer = styled(Box)`
  width: 300px;
  max-height: 400px;
  overflow-y: auto;
`;
export const NotificationHeader = styled(Box)`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 5px 15px;
  border-bottom: 1px solid #ccc;
`;
export const NotificationTitle = styled(Typography)`
font-family: var(--custom-font-family);
font-weight: 600;
font-size: 1.2rem;
`
export const ClearAllBtn = styled(Button)`
  cursor: pointer;
  font-family: var(--custom-font-family);
  color: var(--theme-color-dark);
  text-align: center;
  padding: 5px 10px;
  font-size: 12px;
  font-weight: 600;
  border-radius: 5px;
  text-transform: capitalize;
  &:hover {
    text-decoration: none;
    background-color: rgba(0, 0, 0, 0.04);
  }
`;

export const CustomListItemAvatar = styled(ListItemAvatar)`
  min-width: 40px;
  margin-right: 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  width: 40px;
  height: 40px;
  color: #fff;
  background-color: var(--theme-color);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`