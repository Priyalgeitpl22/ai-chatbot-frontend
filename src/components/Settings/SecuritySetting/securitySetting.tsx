import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "../../../redux/store/store";
import {
  SecurityContainer,
  Title,
  Label,
  Message,
  SwitchRow,
  QRSection,
  QRImage,
  OTPInput,
  VerifyButton
} from "./securitySetting.styled";
import Switch from "@mui/material/Switch";
import api from "../../../services/api";
import { fetchOrganization } from "../../../redux/slice/organizationSlice";
import { AppDispatch } from "../../../redux/store/store";
import {
  Box,
  Button,
  CircularProgress,
  Typography,
} from "@mui/material";

interface Props {
  token: string;
}

const TwoFactorSettings: React.FC<Props> = ({ token }) => {
  const dispatch = useDispatch<AppDispatch>();
  const org = useSelector((state: RootState) => state.organization.data);
  const user = useSelector((state: RootState) => state.user.user);
  const orgId = user?.orgId || org?.id;

  const [twoFA, setTwoFA] = useState(org?.enable_totp_auth || false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);

  const [qrCode, setQrCode] = useState("");
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [isSetupInProgress, setIsSetupInProgress] = useState(false);
  const [isToggleDisabled, setIsToggleDisabled] = useState(!twoFA); // true if 2FA is not enabled

  useEffect(() => {
    setTwoFA(org?.enable_totp_auth || false);
  }, [org]);

  const handleToggle = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = event.target.checked;
    setTwoFA(newValue);
    setLoading(true);
    setError(null);
    setMessage(null);
    try {
      if (!orgId) throw new Error("Organization ID not found");
      await api.put(`/org/?orgId=${orgId}`, { enable_totp_auth: newValue }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMessage(`2FA ${newValue ? "enabled" : "disabled"} for organization.`);
      dispatch(fetchOrganization(orgId));
    } catch (err: any) {
      setError(err?.response?.data?.message || "Failed to update 2FA setting");
      setTwoFA(!newValue); 
    } finally {
      setLoading(false);
    }
  };

  const startSetup = async () => {
    setQrCode("");
    setOtp("");
    setIsSetupInProgress(true);
    try {
      const res = await api.get("/security/2fa/setup", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQrCode(res.data.qrCode || "");
    } catch (err) {
      setError("Error generating QR code.");
    }
  };

  const verifyOtp = async () => {
    if (!otp) return;

    setVerifying(true);
    setError(null);
    setMessage(null);
    try {
      await api.post(
        "/security/2fa/verify",
        { token: otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("2FA successfully enabled.");
      setIsSetupInProgress(false);
      setQrCode("");
      setOtp("");
      setIsToggleDisabled(false); 
      setTwoFA(true);
    } catch (err) {
      setError("Invalid OTP. Try again.");
    } finally {
      setVerifying(false);
    }
  };


  return (
    <SecurityContainer>
      <Title>Two-Factor Authentication (2FA)</Title>
      {message && <Message success>{message}</Message>}
      {error && <Message>{error}</Message>}

      <SwitchRow>
        <Label>
          2FA is{" "}
          <strong style={{ color: "#1e293b" }}>
            {twoFA ? "enabled" : "disabled"}
          </strong>
        </Label>
        <Switch
          checked={twoFA}
          onChange={handleToggle}
          color="primary"
          disabled={isToggleDisabled}
        />
      </SwitchRow>

      {!twoFA && !isSetupInProgress && (
        <Box mt={2}>
          <Button
            variant="contained"
            color="primary"
            onClick={startSetup}
            disabled={loading}
          >
            Set Up 2FA
          </Button>
        </Box>
      )}
      {isSetupInProgress && (
        <QRSection>
          <Typography>Scan the QR Code with Google Authenticator:</Typography>
          <QRImage src={qrCode} alt="2FA QR Code" />
          <OTPInput
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            maxLength={6}
          />
          <VerifyButton
            variant="contained"
            color="success"
            onClick={verifyOtp}
            disabled={verifying || otp.length !== 6}
          >
            {verifying ? <CircularProgress size={22} /> : "Verify OTP"}
          </VerifyButton>
        </QRSection>
      )}
    </SecurityContainer>
  );
};

export default TwoFactorSettings;
