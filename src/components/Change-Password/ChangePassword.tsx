import { useState } from "react";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate,useLocation } from "react-router-dom";
import {
  PageContainer,
  ChangePasswordCard,
  IllustrationSection,
  FormSection,
  StyledButton,
} from "./ChangePassword.styled";
import { AppDispatch } from "../../redux/store/store";
import { changePassword } from "../../redux/slice/authSlice";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader";
import PasswordInput from "../../utils/PasswordInput"; // adjust the path as needed
import fieldValidation from "../../validations/FieldValidation";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const emailFromState = location.state?.email || "";
  const [existingPassword, setExistingPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  // error state for inline field validation
  const [errors, setErrors] = useState({
    existingPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const [loading, setLoading] = useState<boolean>(false);

  const handleChangePassword = async () => {
    const newErrors = {
      existingPassword: "",
      newPassword: "",
      confirmPassword: "",
    };
    let hasError = false;

    if (!existingPassword) {
      newErrors.existingPassword = "Existing password is required";
      hasError = true;
    }

    if (!newPassword) {
      newErrors.newPassword = fieldValidation.password.required?.message || "New password is required";
      hasError = true;
    } else if (newPassword.length < (fieldValidation.password.minLength?.value || 6)) {
      newErrors.newPassword = fieldValidation.password.minLength?.message || "Password must be at least 6 characters";
      hasError = true;
    } else {
      const passwordPattern = new RegExp(fieldValidation.password.pattern?.value || "");
      if (!passwordPattern.test(newPassword)) {
        newErrors.newPassword = fieldValidation.password.pattern?.message || "Password does not meet criteria";
        hasError = true;
      }
    }

    if (!confirmPassword) {
      newErrors.confirmPassword = "Confirm password is required";
      hasError = true;
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = "New password and confirm password do not match";
      hasError = true;
    }

    setErrors(newErrors);
    if (hasError) return;

    setLoading(true);
    try {
      await dispatch(
        changePassword({
          email: emailFromState,
          existingPassword,
          newPassword,
        })
      ).unwrap();
      toast.success("Password updated successfully!");
      navigate("/");
      window.location.reload();
    } catch (error) {
      toast.error(error as string);
    } finally {
      setLoading(false);
    }
  };

  const isDisabled = [existingPassword, newPassword, confirmPassword].some((field) => !field) ||
  Object.values(errors).some((error) => !!error)

  return (
    <PageContainer>
      <ChangePasswordCard>
        <IllustrationSection>
          <img
            src="https://cdn.dribbble.com/users/2058540/screenshots/8225403/media/bc617eec455a72c77feab587e09daa96.gif"
            alt="Auth illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </IllustrationSection>
        <FormSection>
          <Typography variant="h4" fontFamily={"Time New Roman"} fontWeight="bold" mb={1}>
            Change Password
          </Typography>
          <Typography variant="body1" fontFamily={"Time New Roman"} mb={3}>
            Please enter your current password and choose a new password.
          </Typography>
          <PasswordInput
            label="Existing Password"
            name="existingPassword"
            value={existingPassword}
            onChange={(e) => {
              setExistingPassword(e.target.value);
              setErrors((prev) => ({ ...prev, existingPassword: "" }));
            }}
            error={!!errors.existingPassword}
            helperText={errors.existingPassword}
          />
          <PasswordInput
            label="New Password"
            name="newPassword"
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((prev) => ({ ...prev, newPassword: "" }));
            }}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
          <PasswordInput
            label="Confirm Password"
            name="confirmPassword"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({ ...prev, confirmPassword: "" }));
            }}
            error={!!errors.confirmPassword}
            helperText={errors.confirmPassword}
          />

          <StyledButton variant="contained" onClick={handleChangePassword} disabled={isDisabled}>
            Change Password
          </StyledButton>
        </FormSection>
      </ChangePasswordCard>
      {loading && <Loader />}
      <Toaster />
    </PageContainer>
  );
};

export default ChangePassword;
