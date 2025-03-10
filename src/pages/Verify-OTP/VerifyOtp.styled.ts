import styled from "@emotion/styled";
import { Box, Button, TextField, Typography } from "@mui/material";

export const PageContainer = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
`;

export const VerifyCard = styled(Box)`
  background: white;
  border-radius: 20px;
  border: 1px solid #333;
  width: 100%;
  max-width: 800px;
  display: flex;
  overflow: auto;
`;

export const EmailSection = styled(Box)`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  margin-bottom: 20px;

  .MuiTypography-root {
    flex: 1;
    text-align: left;
  }

  .MuiIconButton-root {
    color: var(--theme-color-dark);
  }
`;

export const OtpFieldsContainer = styled(Box)`
  display: flex;
  gap: 10px;
  margin-bottom: 20px;
`;

export const OtpField = styled(TextField)`
  width: 40px;
  height: 40px;
  text-align: center;
  font-size: 18px;
  border-radius: 8px;

  .MuiOutlinedInput-root {
    border-radius: 8px;
    font-weight: bold;
  }

  .MuiOutlinedInput-input {
    padding: 10px;
    text-align: center;
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
  width: 100%;
  max-width: 300px;

  &:hover {
    background: var(--theme-color);
    opacity: 0.9;
  }
`;

export const TimerText = styled(Typography)`
  color: #f44336;
  font-weight: bold;
  text-align: center;
  margin-top: 10px;
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