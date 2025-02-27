import { Paper, styled, TextField } from "@mui/material";

export const FormContainer = styled(Paper)`
  padding: 2rem;
  max-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 15px;
  background: rgba(255, 255, 255, 0.8); 
`;

export const HeaderContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 1rem;
`;

export const StyledTextField = styled(TextField)`
  margin-bottom: 10px;
  .MuiOutlinedInput-root {
    border-radius: 10px;
    background: rgba(255, 255, 255, 0.5);
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.3s ease-in-out;
  }
  .MuiOutlinedInput-root:hover {
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.15);
  }
  .MuiOutlinedInput-root.Mui-focused {
    background: rgba(255, 255, 255, 0.85);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.2);
  }
  .MuiOutlinedInput-input {
    padding: 12px 10px !important;
    transition: color 0.3s ease;
  }
`;
