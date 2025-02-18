import { useState, useEffect } from 'react';
import { Typography } from '@mui/material';
import { Facebook, Linkedin } from 'lucide-react';
import { 
  PageContainer, 
  LoginCard, 
  IllustrationSection, 
  FormSection, 
  StyledTextField, 
  StyledButton, 
  SocialButtonsContainer, 
  SocialButton, 
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

function Login() {
  // Local state for controlled inputs.
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  // A flag to trigger the login effect.
  const [loginSubmitted, setLoginSubmitted] = useState(false);

  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  // Retrieve login-related state from Redux.
  const { loading } = useSelector((state: RootState) => state.user);

  useEffect(() => {
    if (loginSubmitted) {
      (async () => {
        try {
          await dispatch(loginUser({ email, password })).unwrap();

          const token = Cookies.get("access_token");
          if (token) {
            await dispatch(getUserDetails(token)).unwrap();
          }

          toast.success("Logged in successfully!");
          navigate('/');
          window.location.reload();
        } catch (err) {
          console.error('Login failed:', err);
          toast.error("Login failed. Please try again.");
        } finally {
          setLoginSubmitted(false);
        }
      })();
    }
  }, [loginSubmitted, dispatch, navigate]);

  const handleSignIn = () => {
    setLoginSubmitted(true);
  };

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
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Welcome!
          </Typography>
          <Typography variant="body1" color="black" mb={4}>
            Sign in to your Account
          </Typography>

          <StyledTextField 
            fullWidth 
            label="Email Address" 
            variant="outlined" 
            type="email" 
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <StyledTextField 
            fullWidth 
            label="Password" 
            variant="outlined" 
            type="password" 
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          
          <RouterLink 
            to="/forgot-password" 
            style={{ textDecoration: 'none', marginBottom:'10px', color: 'var(--theme-color-dark)' }}
          >
            <ForgotPasswordLink>Forgot Password?</ForgotPasswordLink>
          </RouterLink>
          
          <StyledButton 
            variant="contained" 
            fullWidth 
            onClick={handleSignIn}
            disabled={loading}
          >
            SIGN IN
          </StyledButton>
          <Typography variant="body2" color="black" align="center" sx={{ my: 2 }}>
            Don't have an account?{' '}
            <RouterLink to="/register" style={{ textDecoration: 'none', color: 'var(--theme-color-dark)' }}>
              Register
            </RouterLink>
          </Typography>

          <Typography variant="body2" color="black" align="center" sx={{ my: 1 }}>
            OR LOGIN WITH
          </Typography>

          <SocialButtonsContainer>
            <SocialButton>
              <Facebook size={24} color="#4267B2" />
            </SocialButton>
            <SocialButton>
              <img 
                src="https://www.google.com/images/branding/googleg/1x/googleg_standard_color_128dp.png"
                alt="Google"
                style={{ width: 24, height: 24 }}
              />
            </SocialButton>
            <SocialButton>
              <Linkedin size={24} color="#0077B5" />
            </SocialButton>
          </SocialButtonsContainer>
        </FormSection>
      </LoginCard>

      {loading && <Loader />}
      <Toaster />
    </PageContainer>
  );
}

export default Login;
