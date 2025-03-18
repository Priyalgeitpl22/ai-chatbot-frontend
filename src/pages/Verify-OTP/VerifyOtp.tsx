import { useState, useEffect, useRef } from "react";
import { Typography} from "@mui/material";
import {
  PageContainer,
  VerifyCard,
  OtpFieldsContainer,
  OtpField,
  StyledButton,
  TimerText,
  IllustrationSection,
  FormSection,
  TimerBtnContainer,
  ResendBtn
} from "./VerifyOtp.styled";
import { useLocation, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { resendOtp, verifyOtp } from "../../redux/slice/authSlice";
import { AppDispatch } from "../../redux/store/store";
import Loader from "../../components/Loader";
import toast, { Toaster } from "react-hot-toast";

const VerifyOtp = () => {
  const { state } = useLocation();
  const email = state?.email;

  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(90);
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const [otpSubmitted, setOtpSubmitted] = useState<boolean>(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startTimer = () => {
    setTimer(90);
    setIsTimerRunning(true);

    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    intervalRef.current = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current!);
          setIsTimerRunning(false);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    startTimer();
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  const handleOtpChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const value = e.target.value;
    if (/^\d{0,1}$/.test(value)) {
      setOtp((prevOtp) => {
        const newOtp = [...prevOtp];
        newOtp[index] = value;
        return newOtp;
      });
      if (value && index < otp.length - 1) {
        otpRefs.current[index + 1]?.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === "Backspace") {
      if (!otp[index] && index > 0) {
        otpRefs.current[index - 1]?.focus();
        setOtp((prevOtp) => {
          const newOtp = [...prevOtp];
          newOtp[index - 1] = "";
          return newOtp;
        });
        e.preventDefault();
      }
    }
  };

  const handleVerifyOtp = () => {
    const otpString = otp.join("");
    if (otpString.length === 6) {
      setIsLoading(true);
      setOtpSubmitted(true);
    } else {
      console.log("Please enter a valid OTP");
    }
  };

  useEffect(() => {
    if (otpSubmitted) {
      const otpString = otp.join("");
      dispatch(verifyOtp({ email: email!, otp: otpString }))
        .unwrap()
        .then(result => {
          console.log("OTP verified successfully:", result);
          toast.success("OTP verified successfully!");
          navigate("/login");
        })
        .catch(err => {
          console.error("OTP verification failed:", err);
          toast.error("OTP verification failed. Please try again.");
        })
        .finally(() => {
          setOtpSubmitted(false);
          setIsLoading(false);
        });
    }
  }, [otpSubmitted, dispatch, email, otp, navigate]);

  const handleResendOtp = () => {
    if (!email) return;
    setIsLoading(true);
    dispatch(resendOtp(email!))
      .unwrap()
      .then(() => {
        toast.success("New OTP sent successfully!");
        startTimer();
      })
      .catch(() => {
        toast.error("Failed to resend OTP. Please try again.");
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

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
          <Typography variant="h4" fontWeight="bold"  mb={1}>
            Verify OTP
          </Typography>
          <Typography variant="subtitle2" mb={1}>
            Enter the OTP sent to <b>{email}</b>
          </Typography>

          <OtpFieldsContainer>
            {otp.map((digit, index) => (
              <OtpField
                key={index}
                value={digit}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  handleOtpChange(e, index)
                }
                onKeyDown={(e: React.KeyboardEvent<HTMLInputElement>) =>
                  handleKeyDown(e, index)
                }
                inputProps={{
                  maxLength: 1,
                  ref: (el: HTMLInputElement | null) => (otpRefs.current[index] = el),
                }}
              />
            ))}
          </OtpFieldsContainer>
          <TimerBtnContainer>
            <TimerText>
              Time remaining {Math.floor(timer / 60).toString().padStart(2, "0")}:
              {(timer % 60).toString().padStart(2, "0")}
            </TimerText>
            <ResendBtn
              variant="text"
              onClick={handleResendOtp}
              disabled={isTimerRunning} 
            >
              Resend OTP
            </ResendBtn>
          </TimerBtnContainer>
          <StyledButton variant="contained" onClick={handleVerifyOtp}>
            VERIFY OTP
          </StyledButton>
        </FormSection>
      </VerifyCard>

      {isLoading && <Loader />}
      <Toaster />
    </PageContainer>
  );
};

export default VerifyOtp;
