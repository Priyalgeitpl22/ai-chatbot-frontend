import { useEffect, useState, useCallback } from "react";
import { IconButton, Box, Alert, InputAdornment, Tooltip } from "@mui/material";
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
import { FormContainer, FormTitle, HeaderContainer, StyledTextField } from "./emailConfig.styled";
import { saveConfigurations } from "../../../redux/slice/chatSlice";
import { Info } from "@mui/icons-material";

interface EmailConfigurationProps {
  onSubmit: (data: EmailConfigData) => void;
}

const EmailConfiguration: React.FC<EmailConfigurationProps> = ({ onSubmit }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { user } = useSelector((state: RootState) => state.user);
  const { data } = useSelector((state: RootState) => state.organization);

  const [formData, setFormData] = useState<EmailConfigData>({
    host: "",
    port: "",
    secure: "",
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
    if (data?.emailConfig && Object.values(data.emailConfig).some(v => v)) {
      setFormData(data.emailConfig);
      setIsEditable(false);
      setIsVerified(false);
    } else {
      setIsEditable(true);
      setFormData({
        host: "",
        port: "",
        secure: "",
        user: "",
        pass: "",
      });
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
      await dispatch(
        saveConfigurations({ orgId: user?.orgId, aiOrgId: user?.aiOrgId, emailConfig: config } as any)
      ).unwrap();
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

  console.log("Email Config:", data?.emailConfig);
  console.log("isEditable:", isEditable);


  return (
    <>
      <FormContainer elevation={3}>
        <HeaderContainer>
          <FormTitle>Email Configuration</FormTitle>
          {!isEditable && data?.emailConfig && Object.values(data.emailConfig).some(v => v) && (
            <IconButton onClick={() => { setIsEditable(true); setIsVerified(false); }}>
              <EditIcon />
            </IconButton>
          )}
        </HeaderContainer>
        <Alert severity="info" sx={{ fontFamily: 'var(--custom-font-family)' }}>
          Configure your email settings to enable sending emails from your application.
          Make sure to use secure credentials and enable "Less secure app access" if using Gmail.
        </Alert>
        <form>
          <StyledTextField
            label="SMTP Host"
            name="host"
            value={formData.host}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
            InputProps={{
              readOnly: !isEditable,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="The address of your email server">
                    <Info color="action" />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Port"
            name="port"
            value={formData.port}
            onChange={handleChange}
            fullWidth
            InputLabelProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
            InputProps={{
              readOnly: !isEditable,
              endAdornment: (
                <InputAdornment position="end">
                  <Tooltip title="Common ports: 587 (TLS) or 465 (SSL)">
                    <Info color="action" />
                  </Tooltip>
                </InputAdornment>
              ),
            }}
          />
          <StyledTextField
            label="Use Secure Connection (SSL/TLS)"
            name="secure"
            value={formData.secure}
            onChange={handleChange}
            fullWidth
            InputProps={{ readOnly: !isEditable }}
            InputLabelProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
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
            InputLabelProps={{ style: { fontFamily: 'var(--custom-font-family)' } }}
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
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "5px",
              },
              "& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline": {
                border: "2px solid var(--theme-color)",
              },
            }}
          />
          <Box display="flex" justifyContent="flex-end" alignItems={"center"} mt={2}>
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
