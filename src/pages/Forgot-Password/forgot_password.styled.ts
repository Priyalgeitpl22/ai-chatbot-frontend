import styled from "@emotion/styled";
import { Box, Button, TextField,} from "@mui/material";

export const PageContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const AuthCard = styled(Box)`
  background: white;
  border-radius: 20px;
  border: 1px solid #333;
  width: 100%;
  max-width: 900px;
  display: flex;
  overflow: auto;
`;

export const IllustrationSection = styled(Box)`
  flex: 1;
  background: #f8fbff;
  padding: 40px;
  display: flex;
  align-items: center;
  justify-content: center;

  img {
    max-width: 100%;
    height: auto;
  }

  @media (max-width: 900px) {
    display: none;
  }
`;

export const FormSection = styled(Box)`
  flex: 1;
  padding: 48px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:
`;

export const StyledTextField = styled(TextField)`
  margin-bottom: 10px;

  .MuiOutlinedInput-root {
    border-radius: 10px;
    transition: 0.3s ease-in-out;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid #ddd;
  }

  .MuiOutlinedInput-input {
    padding: 12px 10px !important;
  }
`;

export const StyledButton = styled(Button)`
  height: 40px;
  border-radius: 8px;
  font-weight: bold;
  text-transform: none;
  transition: 0.3s ease-in-out;
  background:  var(--theme-color);
  color: black;

  &:hover {
    background: var(--theme-color);
    opacity: 0.9;
  }
`;


