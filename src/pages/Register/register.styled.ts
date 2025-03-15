import styled from '@emotion/styled';
import { Box, Button, TextField} from '@mui/material';

export const PageContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const RegisterCard = styled(Box)`
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
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: center;

  @media (max-width: 900px) {
    display: none;
  }
`;

export const FormSection = styled(Box)`
  flex: 1;
  padding: 20px;
  display: flex;
  flex-direction: column;
  justify-content: center;
`;
export const PreviewContainer = styled(Box)`
text-align: center;
  margin-bottom: 10px;
`;

export const PreviewImage = styled('img')`
  width: 50px;
  height: 50px;
  object-fit: cover;
  border-radius: 50%;
  border: 2px solid var(--theme-color-dark);
  margin-bottom: 8px;
`;


export const StyledTextField = styled(TextField)`
  margin-bottom: 10px;
  font-family:Times New Roman;
  .MuiOutlinedInput-root {
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
  }


  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid #ddd;
  }
  .MuiOutlinedInput-input {
    padding: 12px 10px !important; 
    font-family:Times New Roman;
  }
`;

export const StyledButton = styled(Button)`
  height: 40px;
  border-radius: 8px;
  font-weight: bold;
  text-transform: none;
  transition: all 0.3s ease-in-out;
  background: var(--theme-color);
  color: black;
  margin-top: 20px;
  font-family:Times New Roman;

  &:hover {
    background: var(--theme-color);
    opacity: 0.9;
  }
  .MuiOutlinedInput-input {
    padding: 12px 10px !important; 
    font-family:Times New Roman;
  }
`;


export const LinkText = styled.a`
  color: #0066cc;
  text-decoration: none;
  font-size: 14px;
  text-align: center;
  cursor: pointer;
  transition: color 0.3s ease-in-out;

  &:hover {
    color: #004a99;
    text-decoration: underline;
  }
`;
