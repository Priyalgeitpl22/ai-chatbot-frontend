import { useEffect, useState, useCallback } from "react";
import { Typography, IconButton, Box } from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { EmailConfigData } from "../Configuration/Configuration";
import { Button } from "../../../styles/layout.styled";
import PasswordInput from "../../../utils/PasswordInput";
import toast, { Toaster } from "react-hot-toast";
import fieldValidation from "../../../validations/FieldValidation";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import { fetchOrganization, updateOrganization, verifyEmail } from "../../../redux/slice/organizationSlice";
import Loader from "../../Loader";
import { FormContainer, HeaderContainer, StyledTextField } from "./emailConfig.styled";

interface EmailConfigurationProps {
  onSubmit: (data: EmailConfigData) => void;
}

const EmailConfiguration: React.FC<EmailConfigurationProps> = ({ onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { data } = useSelector((state: RootState) => state.organization);

  const [formData, setFormData] = useState<EmailConfigData>({
    host: "smtp.gmail.com",
    port: "587",
    secure: "false",
    user: "",
    pass: "",
  });
  const [isVerified, setIsVerified] = useState(false);
  const [isEditable, setIsEditable] = useState(true);
  const [errors, setErrors] = useState<{ user: string }>({ user: "" });
  const [showLoader, setShowLoader] = useState<boolean>(false);

  const getConfig = useCallback(() => ({
    host: formData.host,
    port: formData.port,
    secure: formData.secure,
    user: formData.user,
    pass: formData.pass,
  }), [formData]);

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
      setIsVerified(false);
    }
  }, [data?.emailConfig]);

  useEffect(() => {
    if (user) {
      dispatch(fetchOrganization(user.orgId));
    }
  }, [user, dispatch]);

  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: "" }));
  }, []);

  const validateFields = useCallback(() => {
    let errorMsg = "";
    if (!formData.user) {
      errorMsg = fieldValidation.email.required?.message || "Email is required";
    } else {
      const pattern = new RegExp(fieldValidation.email.pattern?.value || "^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$");
      if (!pattern.test(formData.user)) {
        errorMsg = fieldValidation.email.pattern?.message || "Invalid email format";
      }
    }
    setErrors({ user: errorMsg });
    return !errorMsg;
  }, [formData.user]);

  const handleVerify = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateFields()) return;
    if (user) {
      setShowLoader(true);
      const config = getConfig();
      const response = await dispatch(verifyEmail({ orgId: user.orgId, data: { emailConfig: config } }));
      setShowLoader(false);
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Email configuration verified successfully");
        setIsVerified(true);
      } else {
        toast.error("Error verifying email configuration");
      }
    }
  }, [dispatch, getConfig, user, validateFields]);

  const handleSave = useCallback(async (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      setShowLoader(true);
      const config = getConfig();
      const response = await dispatch(updateOrganization({ orgId: user.orgId, data: { emailConfig: config } }));
      setShowLoader(false);
      if (response.meta.requestStatus === "fulfilled") {
        toast.success("Email configuration updated successfully");
        setIsEditable(false);
        setIsVerified(false);
      } else {
        toast.error("Error updating email configuration");
      }
    }
    onSubmit(formData);
  }, [dispatch, getConfig, user, onSubmit, formData]);

  if (showLoader) return <Loader />;

  return (
    <>
      <FormContainer elevation={3}>
        <HeaderContainer>
          <Typography variant="h6">Email Configuration</Typography>
          {!isEditable && (
            <IconButton onClick={() => { setIsEditable(true); setIsVerified(false); }}>
              <EditIcon />
            </IconButton>
          )}
        </HeaderContainer>
        <form>
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
            required
            fullWidth
            value={formData.pass}
            onChange={handleChange}
            autoComplete="new-password"
            readOnly={!isEditable}
          />
          <Box display="flex" justifyContent="space-between" mt={2}>
            {isEditable && (
              isVerified ? (
                <Button type="button" onClick={handleSave}>Save</Button>
              ) : (
                <Button type="button" onClick={handleVerify}>Verify</Button>
              )
            )}
          </Box>
        </form>
      </FormContainer>
      <Toaster />
    </>
  );
};

export default EmailConfiguration;
