import React, { useState, useEffect } from "react";
import axios from "axios";
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
import { useDispatch } from "react-redux";
import { AppDispatch } from "../../redux/store/store";
import { getUserDetails } from "../../redux/slice/userSlice";

interface Props {
  tempToken: string;
  on2FASuccess: () => void;
}

const TwoFactorOTPLogin: React.FC<Props> = ({ tempToken, on2FASuccess }) => {
  const dispatch = useDispatch<AppDispatch>();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [qrCode, setQrCode] = useState<string | null>(null);
  const [isSetupMode, setIsSetupMode] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    const fetchQRCode = async () => {
      try {
        const res = await axios.get("/api/security/2fa/setup", {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        });
        setQrCode(res.data.qrCode);
      } catch (err) {
        console.error("QR code fetch error:", err);
        toast.error("Failed to fetch QR code");
      }
    };

    if (isSetupMode) {
      fetchQRCode();
    }
  }, [isSetupMode, tempToken]);

  const handleVerify = async () => {
    if (!otp || otp.length !== 6) {
      toast.error("Please enter a valid 6-digit OTP");
      return;
    }

    setLoading(true);
    try {
      if (isSetupMode) {
        await axios.post(
          "/api/security/2fa/verify",
          { token: otp },
          {
            headers: {
              Authorization: `Bearer ${tempToken}`,
            },
          }
        );
        toast.success("2FA setup complete. Logging in...");
      }

      console.log("Sending OTP verification:", {
  otp,
  temp_token: tempToken
});

      const res = await axios.post(
        "/api/security/2fa/verify2FADuringLogin",
        { otp, temp_token: tempToken },
        {
          headers: {
            Authorization: `Bearer ${tempToken}`,
          },
        }
      );

      const finalToken = res.data.token;
      console.log("final Token-----",finalToken)
      Cookies.set("access_token", finalToken, {
        expires: 1,
        path: "/",
        sameSite: "Strict",
        secure: window.location.protocol === "https:",
      });


      await dispatch(getUserDetails(finalToken)).unwrap();
      toast.success("Login successful.");
      on2FASuccess();
    } catch (err) {
      toast.error("Invalid OTP or 2FA failed.");
    } finally {
      setLoading(false);
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
        disabled={loading}
        sx={{ mt: 2 }}
      >
        {loading ? <CircularProgress size={24} color="inherit" /> : "Verify & Login"}
      </Button>

      {msg && <p className="text-sm mt-3 text-blue-600">{msg}</p>}
    </div>
  );
};

export default TwoFactorOTPLogin;
