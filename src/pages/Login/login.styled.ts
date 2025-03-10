import styled from '@emotion/styled';
import { Box, Button, TextField, IconButton } from '@mui/material';

export const PageContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const LoginCard = styled(Box)`
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
`;

export const StyledTextField = styled(TextField)`
  margin-bottom: 10px;
  
  .MuiOutlinedInput-root {
    border-radius: 10px;
    // background: #eef2f7;
    transition: all 0.3s ease-in-out;
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
  transition: all 0.3s ease-in-out;
  background:  var(--theme-color);
  color: black;

  &:hover {
    background:  var(--theme-color);
    opacity: 0.9;
  }
  .MuiOutlinedInput-input {
    padding: 12px 10px !important; 
  }
`;

export const SocialButtonsContainer = styled(Box)`
  display: flex;
  gap: 16px;
  justify-content: center;
`;

export const SocialButton = styled(IconButton)`
  border: 1px solid #e0e0e0;
  padding: 12px;
  transition: all 0.3s ease-in-out;
  
  &:hover {
    background-color: #ffffff;
    transform: scale(1.1);
  }
`;

export const ForgotPasswordLink = styled.div`
  color: #0066cc;
  text-decoration: none;
  font-size: 14px;
  text-align: right;
  margin-bottom: 24px;
  cursor: pointer;
  transition: color 0.3s ease-in-out;
  
  &:hover {
    color: #004a99;
    text-decoration: underline;
  }
`;

export const SignupLink = styled.a`
  color: #0066cc;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  margin-top: 16px;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #004a99;
    text-decoration: underline;
  }
`;
