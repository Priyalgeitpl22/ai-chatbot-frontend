import React, { useState, useEffect } from "react";
import {
  Typography,
  TextField,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel
} from "@mui/material";
import toast from "react-hot-toast";
import Cookies from "js-cookie";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../redux/store/store";
import { getUserDetails } from "../../redux/slice/userSlice";
import { setup2FA, verify2FALogin } from "../../redux/slice/securitySlice";

interface Props {
  tempToken: string;
  on2FASuccess: () => void;
}

const TwoFactorOTPLogin: React.FC<Props> = ({ tempToken, on2FASuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { qrCode, loading } = useSelector((state: RootState) => state.security);
  const [otp, setOtp] = useState("");
  const [localLoading, setLocalLoading] = useState(false);
  const [isSetupMode, setIsSetupMode] = useState(false);

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        await dispatch(setup2FA(tempToken)).unwrap();
        // QR code will be available in the Redux state
      } catch (err) {
        debugger
        console.error("QR code fetch error:", err);
        toast.error("Failed to fetch QR code");
      }
    };

    if (isSetupMode) {
      fetchQRCode();
    }
  }, [isSetupMode, tempToken, dispatch]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLocalLoading(true);
    try {
      console.log("Sending OTP verification:", {
        otp,
        temp_token: tempToken
      });

      const result = await dispatch(verify2FALogin({ tempToken, otp })).unwrap();

      if (result.token) {
        const finalToken = result.token;
        console.log("final Token-----", finalToken);
        
        Cookies.set("access_token", finalToken, {
          expires: 1,
          path: "/",
          sameSite: "Strict",
          secure: window.location.protocol === "https:",
        });

        await dispatch(getUserDetails(finalToken)).unwrap();
        toast.success("Login successful.");
        on2FASuccess();
      }
    } catch (err) {
      toast.error("Invalid OTP or 2FA failed.");
    } finally {
      setLocalLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center p-6 bg-white shadow-md rounded-md max-w-md mx-auto mt-10">
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        Two-Factor Authentication
      </Typography>

      <FormControlLabel
        control={
          <Switch
            checked={isSetupMode}
            onChange={(e) => setIsSetupMode(e.target.checked)}
            color="primary"
          />
        }
        label={isSetupMode ? "Setting up 2FA" : "Already have 2FA"}
      />

      {isSetupMode && qrCode && (
        <>
          <Typography variant="body2" gutterBottom>
            Scan the QR code using Google Authenticator or Authy:
          </Typography>
          <img src={qrCode} alt="QR Code" className="w-48 h-48 my-4" />
        </>
      )}

      <TextField
        label="OTP Code"
        variant="outlined"
        fullWidth
        margin="normal"
        value={otp}
        onChange={(e) => setOtp(e.target.value)}
        inputProps={{ maxLength: 6 }}
      />

      <Button
        variant="contained"
        color="primary"
        fullWidth
        onClick={handleVerify}
        disabled={localLoading}
        sx={{ mt: 2 }}
      >
        {localLoading ? <CircularProgress size={24} color="inherit" /> : "Verify & Login"}
      </Button>

    </div>
  );
};

export default TwoFactorOTPLogin;
