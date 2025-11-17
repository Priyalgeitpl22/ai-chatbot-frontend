import { Button, FormControl, Paper, Select, styled, TextField, Typography} from "@mui/material";

export const FormContainer = styled(Paper)`
  padding-inline: 2rem;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;
export const StyledSelectContainer = styled(FormControl)`
  width: 100%;
  margin-bottom: 15px;

  .MuiInputLabel-root {
    font-family: var(--custom-font-family);
  }
`;

export const StyledSelect = styled(Select)`
  .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.5);
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
  }

  .MuiOutlinedInput-notchedOutline {
    border-color: #d3d3d3;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 2px solid var(--theme-color);
  }

  .MuiSelect-select {
    padding: 12px 10px !important;
    font-family: var(--custom-font-family) !important;
  }
`;

export const StyledTextField = styled(TextField)`
  width: 100%;
  margin-bottom: 15px;

  .MuiOutlinedInput-root {
    background: rgba(255, 255, 255, 0.5);
    transition: all 0.3s ease-in-out;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 2px solid var(--theme-color);
  }

  .MuiOutlinedInput-input {
    padding: 12px 10px !important;
    transition: color 0.3s ease;
    font-family: var(--custom-font-family) !important;
  }
`;
export const FormTitle = styled(Typography)`
  font-size: 2rem;
  padding-bottom:10px;
  font-weight: 700;
  color: #333333;
  font-family: var(--custom-font-family);
`;

export const StyledButton = styled(Button)`
  font-weight: 600;
  width: 100px;
  padding: 8px 12px;
  border: none;
  border-radius: 6px;
  color: #1e293b;
  background-color: var(--theme-color);
  cursor: pointer;
  font-size: 16px;
  font-family: var(--custom-font-family);
  &:hover {
    background-color: var(--theme-color);
    opacity: 0.8;
  }
`;
