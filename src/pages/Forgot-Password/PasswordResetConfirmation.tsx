import { Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { PageContainer, VerifyCard, IllustrationSection, StyledButton } from "../Verify-OTP/VerifyOtp.styled";
import { FormSection } from "./forgot_password.styled";

const PasswordResetConfirmation = () => {
  const navigate = useNavigate();

  return (
    <PageContainer>
      <VerifyCard>
        <IllustrationSection>
        <img
            src="https://cdn.dribbble.com/users/2058540/screenshots/8225403/media/bc617eec455a72c77feab587e09daa96.gif"
            alt="Auth illustration"
            style={{ maxWidth: "100%", height: "auto" }}
          />
        </IllustrationSection>
        <FormSection>
          <Typography variant="h4" fontWeight="bold" mb={1}>
            Check Your Email
          </Typography>
          <Typography variant="h6" sx={{ marginBottom: 2, textAlign: "center", fontSize: "18px" }}>
            We've sent you a password reset link. Please check your inbox (or spam folder).
          </Typography>

          <StyledButton variant="contained" onClick={() => navigate("/login")}>
            Return to Login
          </StyledButton>
        </FormSection>
      </VerifyCard>
    </PageContainer>
  );
};

export default PasswordResetConfirmation;
