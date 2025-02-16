import styled from "@emotion/styled";
import { Box, TextField, IconButton } from "@mui/material";

export const ChatContainer = styled(Box)`
  width: 350px;
  height: 98%;
  border-radius: 8px;
  overflow: auto;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  background: white;
  position: relative;
  // background: var(--white-fade-gradient);
`;

export const Header = styled(Box)<{ bgcolor: string }>`
  background-color: ${({ bgcolor }) => bgcolor || "#343a40"};
  color: white;
  padding: 12px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 10px;
`;

export const Logo = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 50%;
`;

export const ChatBody = styled(Box)`
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 10px;
  height: 350px;
  overflow-y: auto;
`;

export const Message = styled(Box)`
  background-color: #f1f1f1;
  padding: 8px;
  border-radius: 8px;
  max-width: 70%;
  word-break: break-all;
`;

export const InputContainer = styled(Box)`
  padding: 10px;
  position: relative;
`;

export const StyledTextField = styled(TextField)`
  .MuiOutlinedInput-root {
    border-radius: 10px;
    padding: 4px 8px;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid #ddd;
  }
  &:hover .MuiOutlinedInput-notchedOutline {
    border: 1px solid #ddd;  // Remove border color on hover
  }


`;

export const OpenButton = styled(IconButton)<{ bgcolor: string }>`
  position: fixed;
  bottom: 20px;
  right: 20px;
  background-color: ${({ bgcolor }) => bgcolor || "#343a40"};
  color: white;
  z-index: 10;
  &:hover {
    background-color: ${({ bgcolor }) =>
      bgcolor ? `${bgcolor}aa` : "#5a6268"};
  }
`;

export const EmojiPickerContainer = styled(Box)`
  position: absolute;
  bottom: 60px;
  left: 10px;
  z-index: 10;
`;

export const DropdownIconButton = styled(IconButton)`
  align-self: flex-end;
  color: white;
  &:hover {
    background-color: rgba(255, 255, 255, 0.2);
  }
`;
