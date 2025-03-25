import { useState } from "react";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import { useNavigate, useLocation } from "react-router-dom";
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
import PasswordInput from "../../utils/PasswordInput";
import fieldValidation from "../../validations/FieldValidation";

const ChangePassword: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch<AppDispatch>();
  const location = useLocation();
  const emailFromState = location.state?.email || "";
  const [existingPassword, setExistingPassword] = useState<string>("");
  const [newPassword, setNewPassword] = useState<string>("");
  const [confirmPassword, setConfirmPassword] = useState<string>("");

  const [errors, setErrors] = useState({
    existingPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState<boolean>(false);

  const validatePassword = (password: string) => {
    const rules = fieldValidation.password;
    let errorMessages: string[] = [];

    if (!password) {
      errorMessages.push(rules.required?.message || "Password is required");
    }
    if (password.length < (rules.minLength?.value || 6)) {
      errorMessages.push(rules.minLength?.message || "Password must be at least 6 characters");
    }
    if (rules.pattern && !new RegExp(rules.pattern.value).test(password)) {
      errorMessages.push(rules.pattern?.message || "Password does not meet criteria");
    }

    return errorMessages.length ? errorMessages.join("\n") : "";
  };

  const handleChangePassword = async () => {
    const newErrors = {
      existingPassword: existingPassword ? "" : "Existing password is required",
      newPassword: validatePassword(newPassword),
      confirmPassword: confirmPassword
        ? newPassword === confirmPassword
          ? ""
          : "Passwords do not match"
        : "Confirm password is required",
    };

    setErrors(newErrors);

    if (Object.values(newErrors).some((err) => err)) return;

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

  const isDisabled =
    !existingPassword ||
    !newPassword ||
    !confirmPassword ||
    Object.values(errors).some((err) => err);

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
          <Typography variant="h4" fontFamily={"Times New Roman"} fontWeight="bold" mb={1}>
            Change Password
          </Typography>
          <Typography variant="body1" fontFamily={"Times New Roman"} mb={3}>
            Please enter your current password and choose a new password.
          </Typography>
          <PasswordInput
            label="Existing Password"
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
            value={newPassword}
            onChange={(e) => {
              setNewPassword(e.target.value);
              setErrors((prev) => ({ ...prev, newPassword: validatePassword(e.target.value) }));
            }}
            error={!!errors.newPassword}
            helperText={errors.newPassword}
          />
          <PasswordInput
            label="Confirm Password"
            value={confirmPassword}
            onChange={(e) => {
              setConfirmPassword(e.target.value);
              setErrors((prev) => ({
                ...prev,
                confirmPassword:
                  e.target.value === newPassword ? "" : "Passwords do not match",
              }));
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
