import { Paper, styled, TextField, Typography } from "@mui/material";

export const FormContainer = styled(Paper)`
  padding-inline: 2rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.8); 
  box-shadow: none;
`;

export const FormTitle = styled(Typography)`
  font-size: 2rem;
  font-weight: 700;
  color: #333333;
  font-family: var(--custom-font-family);
`;

export const HeaderContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
`;

export const StyledTextField = styled(TextField)`
  margin-bottom: 15px;
  .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease-in-out;
  }
  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline{
    border: 2px solid var(--theme-color);
  },
  .MuiOutlinedInput-input {
    padding: 12px 10px !important;
    transition: color 0.3s ease;
    font-family: var(--custom-font-family) !important;
  }
`;
