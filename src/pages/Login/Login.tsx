import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import {
  PageContainer,
  LoginCard,
  IllustrationSection,
  FormSection,
  StyledTextField,
  StyledButton,
  ForgotPasswordLink
} from './login.styled';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { loginUser } from '../../redux/slice/authSlice';
import { AppDispatch, RootState } from '../../redux/store/store';
import Loader from '../../components/Loader';
import Cookies from "js-cookie";
import { getUserDetails } from '../../redux/slice/userSlice';
import toast, { Toaster } from "react-hot-toast";
import fieldValidation from '../../validations/FieldValidation';
import PasswordInput from "../../utils/PasswordInput";

const getValidationError = (
  field: 'email' | 'password',
  value: string
): string => {
  const rules = fieldValidation[field];
  if (!rules) return "";
  if (rules.required && (!value || value.trim() === "")) {
    return rules.required.message;
  }
  if (typeof value === "string") {
    if (rules.minLength && value.length < rules.minLength.value) {
      return rules.minLength.message;
    }
    if (rules.pattern) {
      const patternRegex = new RegExp(rules.pattern.value);
      if (!patternRegex.test(value)) {
        return rules.pattern.message;
      }
    }
  }
  return "";
};

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const [errors, setErrors] = useState<{ email?: string; password?: string }>({});
  const [loginSubmitted, setLoginSubmitted] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const { loading } = useSelector((state: RootState) => state.user);

  const validateFields = () => {
    const validationErrors: { email?: string; password?: string } = {};

    validationErrors.email = getValidationError('email', email);
    validationErrors.password = getValidationError('password', password);

    Object.keys(validationErrors).forEach((key) => {
      if (!validationErrors[key as keyof typeof validationErrors]) {
        delete validationErrors[key as keyof typeof validationErrors];
      }
    });

    return validationErrors;
  };

  const handleEmailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEmail(e.target.value);
    if (errors.email) {
      setErrors((prev) => ({ ...prev, email: undefined }));
    }
  };

  const handlePasswordChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.target.value);
    if (errors.password) {
      setErrors((prev) => ({ ...prev, password: undefined }));
    }
  };

  const handleSignIn = () => {
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    setErrors({});
    setLoginSubmitted(true);
  };

  useEffect(() => {
    if (loginSubmitted) {
      (async () => {
        try {
          await dispatch(loginUser({ email, password })).unwrap().then((res)=>{
            toast.success(res as string);
          });
          const token = Cookies.get("access_token");
          if (token) {
            await dispatch(getUserDetails(token)).unwrap();
          }
          navigate('/');
          window.location.reload();
        } catch (err) {
          console.error('Login failed:', err);
          toast.error(err as string);
        } finally {
          setLoginSubmitted(false);
        }
      })();
    }
  }, [loginSubmitted, dispatch, navigate, email, password]);

  const isFormValid = email && password && !errors.email && !errors.password;
  return (
    <PageContainer>
      <LoginCard>
        <IllustrationSection>
          <img 
            src="https://cdn.dribbble.com/users/2058540/screenshots/8225403/media/bc617eec455a72c77feab587e09daa96.gif" 
            alt="Login illustration"
            style={{ maxWidth: '100%', height: 'auto' }}
          />
        </IllustrationSection>
        
        <FormSection>
          <Typography variant="h4" fontWeight="bold" fontFamily={"var(--custom-font-family)"} mb={1}>
            Welcome!
          </Typography>
          <Typography variant="body1" color="black" fontFamily={"var(--custom-font-family)"} mb={4}>
            Sign in to your Account
          </Typography>

          <StyledTextField 
            fullWidth 
            label="Email Address *" 
            variant="outlined" 
            type="email" 
            value={email}
            onChange={handleEmailChange}
            error={!!errors.email}
            helperText={errors.email}
            autoComplete='nope'
            InputLabelProps={{style: {fontFamily: 'var(--custom-font-family)'}}}
          />
          
          <PasswordInput 
            label="Password"
            value={password}
            onChange={handlePasswordChange}
            error={!!errors.password}
            autoComplete='new-password'
            helperText={errors.password || ""}
            onkeydown={(e:React.KeyboardEvent)=>{if(e.key==="Enter")handleSignIn()}}
          />
          
          <RouterLink 
            to="/forgot-password" 
            style={{ textDecoration: 'none', marginBottom:'10px', alignSelf: 'flex-end', color: 'var(--theme-color-dark)' }}
          >
            <ForgotPasswordLink>Forgot Password?</ForgotPasswordLink>
          </RouterLink>
          
          <StyledButton 
            variant="contained" 
            fullWidth 
            onClick={handleSignIn}
            disabled={!isFormValid}
          >
            SIGN IN
          </StyledButton>
          <Typography variant="body2" color="black" align="center" fontFamily={"var(--custom-font-family)"} sx={{ my: 2 }}>
            Don't have an account?{' '}
            <RouterLink to="/register" style={{ textDecoration: 'none', color: 'var(--theme-color-dark)' }}>
              Register
            </RouterLink>
          </Typography>
        </FormSection>
      </LoginCard>

      {loading && <Loader />}
      <Toaster />
    </PageContainer>
  );
}

export default Login;
