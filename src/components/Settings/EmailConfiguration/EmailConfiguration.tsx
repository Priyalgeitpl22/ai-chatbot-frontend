import { useEffect, useState } from "react";
import { TextField, Typography, Paper, IconButton } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import styled from "@emotion/styled";
import { EmailConfigData } from "../Configuration/Configuration";
import { Button } from "../../../styles/layout.styled";
import PasswordInput from "../../../utils/PasswordInput";
import toast, { Toaster } from "react-hot-toast";
import fieldValidation from "../../../validations/FieldValidation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { fetchOrganization, updateOrganization } from "../../../redux/slice/organizationSlice";
import Loader from "../../Loader";

const FormContainer = styled(Paper)`
  padding: 2rem;
  min-width: 400px;
  margin: auto;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  border-radius: 8px;
`;

const HeaderContainer = styled("div")`
  display: flex;
  align-items: center;
  justify-content: space-between;
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
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { data, loading } = useSelector((state: RootState) => state.organization);

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

  const [isEditable, setIsEditable] = useState(true);

  useEffect(() => {
    if (data) {
      setFormData({
        host: data.emailConfig.host,
        port: data.emailConfig.port,
        secure: data.emailConfig.secure,
        user: data.emailConfig.user,
        pass: data.emailConfig.pass,
      });
      setIsEditable(false);
    }
  }, [data?.emailConfig]);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrganization(user.orgId));
    }
  }, [user, dispatch]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    let newErrors = { user: "", pass: "" };

    if (!formData.user) {
      newErrors.user =
        fieldValidation.email.required?.message || "Email is required";
    } else {
      const emailPattern = new RegExp(
        fieldValidation.email.pattern?.value ||
          "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$"
      );
      if (!emailPattern.test(formData.user)) {
        newErrors.user =
          fieldValidation.email.pattern?.message || "Invalid email format";
      }
    }

    if (!formData.pass) {
      newErrors.pass =
        fieldValidation.password.required?.message || "Password is required";
    } else if (
      formData.pass.length < (fieldValidation.password.minLength?.value || 6)
    ) {
      newErrors.pass =
        fieldValidation.password.minLength?.message || "Password too short";
    } else {
      const passwordPattern = new RegExp(
        fieldValidation.password.pattern?.value ||
          "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[^\\da-zA-Z]).+$"
      );
      if (!passwordPattern.test(formData.pass)) {
        newErrors.pass =
          fieldValidation.password.pattern?.message ||
          "Password does not meet criteria";
      }
    }

    setErrors(newErrors);
    if (newErrors.user || newErrors.pass) {
      return;
    }

    const config = {
      host: formData.host,
      port: formData.port,
      secure: formData.secure,
      user: formData.user,
      pass: formData.pass,
    };

    if (user) {
      const response = await dispatch(
        updateOrganization({ orgId: user.orgId, data: { emailConfig: config } })
      );
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Email configuration updated successfully");
      }
    }
    onSubmit(formData);
    setIsEditable(false);
  };

  if (loading) {
    return <Loader />;
  }


  return (
    <>
      <FormContainer elevation={3} onSubmit={handleSubmit}>
        <HeaderContainer>
          <Typography variant="h6">Email Configuration</Typography>
          {/* When the form is read-only, show the edit icon */}
          {!isEditable && (
            <IconButton onClick={() => setIsEditable(true)}>
              <EditIcon />
            </IconButton>
          )}
        </HeaderContainer>
        <StyledTextField
          label="SMTP Host"
          name="host"
          value={formData.host}
          onChange={handleChange}
          fullWidth
          InputProps={{ readOnly: !isEditable }}
        />
        <StyledTextField
          label="Port"
          name="port"
          type="number"
          value={formData.port}
          onChange={handleChange}
          fullWidth
          InputProps={{ readOnly: !isEditable }}
        />
        <StyledTextField
          label="Secure (true/false)"
          name="secure"
          value={formData.secure}
          onChange={handleChange}
          fullWidth
          InputProps={{ readOnly: !isEditable }}
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
          InputProps={{ readOnly: !isEditable }}
        />
        <PasswordInput
          label="Email Password"
          name="pass"
          value={formData.pass}
          onChange={handleChange}
          error={!!errors.pass}
          helperText={errors.pass}
          autoComplete="new-password"
          readOnly={!isEditable}
        />
        {/* Show Save button only when in edit mode */}
        {isEditable && (
          <Button type="submit" onClick={handleSubmit}>
            Save
          </Button>
        )}
      </FormContainer>
      <Toaster />
    </>
  );
};

export default EmailConfiguration;
