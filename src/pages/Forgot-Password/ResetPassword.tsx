import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDispatch, useSelector } from "react-redux";
import {
  PageContainer,
  AuthCard,
  IllustrationSection,
  FormSection,
  StyledButton,
} from "../../components/ActivateAccount/activateAccount.styled";
import { resetPassword } from "../../redux/slice/authSlice";
import { AppDispatch, RootState } from "../../redux/store/store";
import toast, { Toaster } from "react-hot-toast";
import fieldValidation from "../../validations/FieldValidation";
import PasswordInput from "../../utils/PasswordInput";
import Loader from "../../components/Loader";

const ResetPassword = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();

  const { loading, success } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const searchToken = searchParams.get("token");
    const searchEmail = searchParams.get("email");

    if (searchToken && searchEmail) {
      setToken(searchToken);
      setEmail(searchEmail);
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  useEffect(() => {
    if (success) {
      navigate("/login");
    }
  }, [success, navigate]);

  const validatePassword = (password: string) => {
    const rules = fieldValidation.password;
    if (rules.required && !password) {
      return rules.required.message;
    }
    if (rules.minLength && password.length < rules.minLength.value) {
      return rules.minLength.message;
    }
    if (rules.pattern && !new RegExp(rules.pattern.value).test(password)) {
      return rules.pattern.message;
    }
    return null;
  };

  const handleSubmitPassword = async () => {
    const validationError = validatePassword(password);
    if (validationError) {
      setError(validationError);
      return;
    }
    setError(null);

    if (!password || !token || !email) {
      return;
    }

    try {
    await dispatch(resetPassword({ token, password, email })).unwrap().then((result) => {
        toast.success(result.message);
        navigate("/login");  
    });
      
    } catch (err: any) {      
      toast.error(err.message);
    }
  };

  return (
    <PageContainer>
      {loading && <Loader />}
      <AuthCard>
        <IllustrationSection>
          <img
            src="https://cdn.dribbble.com/users/2058540/screenshots/8225403/media/bc617eec455a72c77feab587e09daa96.gif"
            alt="Account Activation Illustration"
          />
        </IllustrationSection>

        <FormSection>
          <Typography variant="h4" fontFamily={"var(--custom-font-family)"} fontWeight="bold" mb={1}>
            Reset Password
          </Typography>
          <Typography variant="body1" fontFamily={"var(--custom-font-family)"} color="black" mb={3}>
            Your identity has been verified. Set your new password.
          </Typography>

          <PasswordInput
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error || ""}
          />

          <StyledButton fullWidth onClick={handleSubmitPassword} disabled={!password} >
            Reset Password
          </StyledButton>
        </FormSection>
      </AuthCard>
      <Toaster />
    </PageContainer>
  );
};

export default ResetPassword;
