import React, { useState } from "react";
import { IconButton, InputAdornment, styled, TextField } from "@mui/material";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";

interface PasswordInputProps {
  name?: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
  error?: boolean;
  helperText?: string;
}

const StyledTextField = styled(TextField)`
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

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const togglePasswordVisibility = () => setShowPassword((prev) => !prev);

  return (
    <StyledTextField
      name={name}
      label={label}
      variant="outlined"
      type={showPassword ? "text" : "password"}
      value={value}
      onChange={onChange}
      autoComplete="new-password"
      error={error}
      helperText={helperText}
      InputProps={{
        endAdornment: (
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end">
              {showPassword ? <VisibilityOff /> : <Visibility />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
