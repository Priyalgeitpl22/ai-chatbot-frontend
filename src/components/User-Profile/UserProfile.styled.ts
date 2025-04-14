import { Box, MenuItem, styled } from "@mui/material";

export const ProfileIcon = styled(Box)`
  cursor: pointer;
  border-radius: 50%;
  overflow: auto;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    opacity: 0.9;
  }
`;

export const StyledMenuItem = styled(MenuItem)`
  display: flex;
  align-items: center;
  padding: 10px 20px;
  &:hover {
    background-color: #f1f1f1;
  }
`;

export const UserProfileContainer = styled(Box)`
  display: flex;
  align-items: center;
`

export const ProfileNameContainer = styled(Box)`
  flex-direction: column;
  display: flex;
  align-items: flex-end;  // Align text to the right
  justify-content: center;
  text-align: right;
  white-space: nowrap; // Prevents text from breaking into two lines
  overflow: hidden;
  text-overflow: ellipsis; // Adds "..." if text overflows
  margin-right: 10px;
`;




