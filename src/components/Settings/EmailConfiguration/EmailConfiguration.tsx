import { useState } from "react";
import { TextField, Typography, Paper } from "@mui/material";
import styled from "@emotion/styled";
import { EmailConfigData } from "../Configuration/Configuration";
import { Button } from "../../../styles/layout.styled";
import PasswordInput from "../../../utils/PasswordInput";
import toast, { Toaster } from "react-hot-toast";
import fieldValidation from "../../../validations/FieldValidation";

const FormContainer = styled(Paper)`
  padding: 2rem;
  min-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 8px;
`;
const StyledTextField = styled(TextField)`
  margin-bottom: 10px;
  .MuiOutlinedInput-root {
    border-radius: 10px;
    transition: all 0.3s ease-in-out;
  }


  .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline {
    border: 1px solid #ddd;
  }
  .MuiOutlinedInput-input {
    padding: 12px 10px !important; 
  }
`;

interface EmailConfigurationProps {
  onSubmit: (data: EmailConfigData) => void;
}

const EmailConfiguration: React.FC<EmailConfigurationProps> = ({ onSubmit }) => {
  const [formData, setFormData] = useState<EmailConfigData>({
    host: "smtp.gmail.com",
    port: "587",
    secure: "false",
    user: "",
    pass: "",
  });

  const [errors, setErrors] = useState<{ user: string; pass: string }>({
    user: "",
    pass: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error on change for the field being updated.
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors = { user: "", pass: "" };

    // Validate Email User
    if (!formData.user) {
      newErrors.user = fieldValidation.email.required?.message || "Email is required";
    } else {
      const emailPattern = new RegExp(
        fieldValidation.email.pattern?.value || "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
      );
      if (!emailPattern.test(formData.user)) {
        newErrors.user = fieldValidation.email.pattern?.message || "Invalid email format";
      }
    }

    // Validate Email Password
    if (!formData.pass) {
      newErrors.pass = fieldValidation.password.required?.message || "Password is required";
    } else if (formData.pass.length < (fieldValidation.password.minLength?.value || 6)) {
      newErrors.pass = fieldValidation.password.minLength?.message || "Password too short";
    } else {
      const passwordPattern = new RegExp(
        fieldValidation.password.pattern?.value ||
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).+$"
      );
      if (!passwordPattern.test(formData.pass)) {
        newErrors.pass =
          fieldValidation.password.pattern?.message || "Password does not meet criteria";
      }
    }

    setErrors(newErrors);
    // If any error exists, do not submit.
    if (newErrors.user || newErrors.pass) {
      return;
    }

    onSubmit(formData);
    toast.success("Email configuration saved successfully.");
  };

  return (
    <>
      <FormContainer elevation={3} onSubmit={handleSubmit}>
        <Typography variant="h6" textAlign="center">
          Email Configuration
        </Typography>
        <StyledTextField
          label="SMTP Host"
          name="host"
          value={formData.host}
          onChange={handleChange}
          fullWidth
        />
        <StyledTextField
          label="Port"
          name="port"
          type="number"
          value={formData.port}
          onChange={handleChange}
          fullWidth
        />
        <StyledTextField
          label="Secure (true/false)"
          name="secure"
          value={formData.secure}
          onChange={handleChange}
          fullWidth
        />
        <StyledTextField
          label="Email User"
          name="user"
          value={formData.user}
          onChange={handleChange}
          autoComplete="nope"
          fullWidth
          required
          error={!!errors.user}
          helperText={errors.user}
        />
        <PasswordInput
          label="Email Password"
          name="pass"
          value={formData.pass}
          onChange={handleChange}
          error={!!errors.pass}
          helperText={errors.pass}
          autoComplete="new-password"
        />
        <Button type="submit" onClick={handleSubmit}>Save</Button>
      </FormContainer>
      <Toaster />
    </>
  );
};

export default EmailConfiguration;
