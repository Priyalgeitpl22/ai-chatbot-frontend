import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Typography } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  PageContainer,
  AuthCard,
  IllustrationSection,
  FormSection,
  StyledButton,
} from "./activateAccount.styled";
import { AppDispatch } from "../../redux/store/store";
import { activateAccount } from "../../redux/slice/authSlice";
import toast, { Toaster } from "react-hot-toast";
import Loader from "../Loader";
import fieldValidation from "../../validations/FieldValidation";
import PasswordInput from "../../utils/PasswordInput"; 

const ActivateAccount = () => {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [token, setToken] = useState<string | null>(null);
  const [email, setEmail] = useState<string | null>(null);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const dispatch = useDispatch<AppDispatch>();
  const [loading, setLoading] = useState<boolean>(false);

  useEffect(() => {
    const token = searchParams.get("token");
    const email = searchParams.get("email");

    if (token && email) {
      setToken(token);
      setEmail(email);
    } else {
      navigate("/login");
    }
  }, [searchParams, navigate]);

  const validatePassword = (password: string): string | null => {
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
    setError("");

    if (!password || !token || !email) {
      return;
    }

    const payload = {
      token,
      password,
      email,
    };
    try {
      setLoading(true);
      const response = await dispatch(activateAccount(payload)).unwrap();
      if (response.code === 200) {
        toast.success("Account activated successfully. Please login to continue.");
        navigate("/login");
      }
    } catch (error: any) {
      console.error("Error activating account:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <PageContainer>
      <AuthCard>
        <IllustrationSection>
          <img
            src="https://cdn.dribbble.com/users/2058540/screenshots/8225403/media/bc617eec455a72c77feab587e09daa96.gif"
            alt="Account Activation Illustration"
          />
        </IllustrationSection>

        <FormSection>
          <Typography variant="h4" fontFamily={"var(--custom-font-family)"} fontWeight="bold" mb={1}>
            Activate Account
          </Typography>
          <Typography variant="body1" fontFamily={"var(--custom-font-family)"} color="black" mb={3}>
            Enter your new password to activate your account.
          </Typography>

          <PasswordInput
            label="New Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={!!error}
            helperText={error}
          />

          <StyledButton fullWidth onClick={handleSubmitPassword} disabled={!password}>
            Activate Account
          </StyledButton>
        </FormSection>
        {loading && <Loader />}
        <Toaster />
      </AuthCard>
    </PageContainer>
  );
};

export default ActivateAccount;
