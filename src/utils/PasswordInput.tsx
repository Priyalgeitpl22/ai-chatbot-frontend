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
  required?: boolean;
  readOnly?: boolean; 
  fullWidth?: boolean;
  sx?: object;
}

const StyledTextField = styled(TextField)`
  margin-bottom: 5px;
  .MuiFormHelperText-root{
  margin: 0px;
  }

  .MuiOutlinedInput-root {
    border-radius: 10px;
    transition: 0.3s ease-in-out;
  }

  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid #ddd;
  }

  .MuiOutlinedInput-input {
    padding: 12px 10px !important;
    font-family:var(--custom-font-family);
  }
`;

const PasswordInput: React.FC<PasswordInputProps> = ({
  name,
  label,
  value,
  onChange,
  error,
  helperText,
  readOnly = false,
  sx,
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
      required
      fullWidth
      sx={sx}
      InputLabelProps={{style: {fontFamily: 'var(--custom-font-family)'}}}
      InputProps={{
        readOnly: readOnly,
        endAdornment: value.length > 0 &&(
          <InputAdornment position="end">
            <IconButton onClick={togglePasswordVisibility} edge="end">
              {showPassword ? <Visibility />:<VisibilityOff />}
            </IconButton>
          </InputAdornment>
        ),
      }}
    />
  );
};

export default PasswordInput;
