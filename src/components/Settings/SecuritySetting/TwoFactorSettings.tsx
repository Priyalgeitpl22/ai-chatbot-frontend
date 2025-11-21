import React, {useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import api from "../../../services/api";
import {
  Box,
  CircularProgress,
  Typography,
  Modal,
  Stack,
  Paper,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import QrCode2Icon from "@mui/icons-material/QrCode2";
import AddIcon from "@mui/icons-material/Add";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import {
  PrimaryButton,
  OutlinedBlueButton,
  Title,
  Label,
  InfoText,
  ModalPaper,
  TitleTypography,
  DescriptionTypography,
  TwoFABox,
} from "./securitySetting.styled";
import {
  CustomWrapper,
  TitleWrapper,
} from "../NotificationSettings/notificationSettingsStyled";
import { getUserDetails, updateUserDetails } from "../../../redux/slice/userSlice";

const TwoFactorSettings: React.FC<{ token: string }> = ({ token }) => {
  const org = useSelector((state: RootState) => state.organization.data);
  const user = useSelector((state: RootState) => state.user.user);
  const dispatch = useDispatch<AppDispatch>();
  const twoFA = org?.enable_totp_auth && user?.twoFactorAuth?.isEnabled;
  const [error, setError] = useState<string | null>(null);
  const [qrCode, setQrCode] = useState("");
  const [showSetupModal, setShowSetupModal] = useState(false);
  const [showAuthenticatorModal, setShowAuthenticatorModal] = useState(false);
  const [loadingQR, setLoadingQR] = useState(false);
  const [showTurnOffModal, setShowTurnOffModal] = useState(false);
  const [otpToDisable, setOtpToDisable] = useState("");
  const [disableError, setDisableError] = useState("");
  const [showOtpVerifyModal, setShowOtpVerifyModal] = useState(false);
  const [otp, setOtp] = useState("");
  const [verifying, setVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState("");
  const [disabling, setDisabling] = useState(false);
  const [enabledAt, setEnabledAt] = useState(user?.twoFactorAuth?.enabledAt || null);

  const daysAgo = user?.twoFactorAuth?.authenticatorAppAddedAt
    ? Math.floor(
      (Date.now() -
        new Date(user?.twoFactorAuth?.authenticatorAppAddedAt).getTime()) /
      (1000 * 60 * 60 * 24)
    )
    : null;

  const handleStartSetup = async () => {
    setShowAuthenticatorModal(true);
  };


  const handleSetupAuthenticator = async () => {
    setQrCode("");
    setOtp("");
    setShowSetupModal(true);
    setShowAuthenticatorModal(false);
    setLoadingQR(true);
    try {
      const res = await api.get("/security/2fa/setup", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setQrCode(res.data.qrCode || "");
    } catch (err) {
      setQrCode("");
      setError("Error generating QR code.");
    }
    setLoadingQR(false);
  };

  const verifyOtp = async () => {
    if (!otp) return;
    setVerifying(true);
    setError(null);
    try {
      await api.post(
        "/security/2fa/verify",
        { token: otp, email: user?.email },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setShowOtpVerifyModal(false);
      setShowSetupModal(false);
      setQrCode("");
      setOtp("");
      const now = new Date().toISOString();
      setEnabledAt(now);
      setShowAuthenticatorModal(false);
      await dispatch(
        updateUserDetails({
          userData: {
            id: user?.id,
            twoFactorAuth: {
              isEnabled: true,
              enabledAt: now,
            }
          }
        })
      ).unwrap();
      await dispatch(getUserDetails(token));  // <-- ADD THIS


    } catch {
      setVerifyError("Invalid code. Try again.");
    }
    setVerifying(false);
  };

  return (
    <Box>
      <TitleWrapper>
        <Title>Security Settings</Title>
      </TitleWrapper>

      <CustomWrapper>
        <Box>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Label sx={{ fontSize: "1.25rem", fontWeight: 500, color: "#1e293b", marginBottom: 4, display: "flex", alignItems: "center", gap: 1 }}>
              {!twoFA && (
                <WarningAmberRoundedIcon sx={{ color: "#ef4444", fontSize: 24 }} />
              )}
              {twoFA
                ? "Your account is protected with 2-Step Verification"
                : "Two-Step Verification is not enabled."}
            </Label>
            {twoFA && (
              <Box display="flex" alignItems="center">
                <CheckCircleIcon sx={{ color: "green", fontSize: 22, mr: 1 }} />
                <Typography sx={{ color: "#1e293b", fontWeight: 500 }}>
                  On since{" "}
                  {enabledAt &&
                    new Date(enabledAt).toLocaleDateString(
                      "en-GB",
                      {
                        day: "2-digit",
                        month: "short",
                      }
                    )}
                </Typography>
                <ChevronRightIcon sx={{ color: "#bdbdbd", fontSize: 22 }} />
              </Box>
            )}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center",
              gap: "80px",
            }}
          >
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              {user?.role === "Admin" ? (
                <>
                  <InfoText>
                    Prevent hackers from accessing your account with an
                    additional layer of security.
                  </InfoText>
                  <br />
                  <InfoText>
                    Unless you’re signing in with a passkey, you’ll be asked to
                    complete the most secure second step available on your
                    account.
                  </InfoText>
                  <Stack direction="row" spacing={2} mt={3}>
                    <OutlinedBlueButton
                      variant="outlined"
                      onClick={
                        twoFA
                          ? () => setShowTurnOffModal(true)
                          : handleStartSetup
                      }
                    >
                      {twoFA
                        ? "Turn off 2-Step Verification"
                        : "Turn on 2-Step Verification"}
                    </OutlinedBlueButton>
                  </Stack>
                </>
              ) : org?.enable_totp_auth ? (
                <>
                  <InfoText>
                    Prevent hackers from accessing your account with an
                    additional layer of security.
                  </InfoText>
                  <br />
                  <InfoText>
                    Unless you’re signing in with a passkey, you’ll be asked to
                    complete the most secure second step available on your
                    account.
                  </InfoText>
                  <Stack direction="row" spacing={2} mt={3}>
                    <OutlinedBlueButton
                      variant="outlined"
                      onClick={
                        twoFA
                          ? () => setShowTurnOffModal(true)
                          : handleStartSetup
                      }
                    >
                      {twoFA
                        ? "Turn off 2-Step Verification"
                        : "Turn on 2-Step Verification"}
                    </OutlinedBlueButton>
                  </Stack>
                </>
              ) : (
                <>
                  <InfoText>
                    2-Step Verification is not enabled for your organization.
                    Please contact your administrator to enable this security
                    feature.
                  </InfoText>
                  <Stack direction="row" spacing={2} mt={3}>
                    <OutlinedBlueButton
                      variant="outlined"
                      disabled={true}
                    >Turn on 2-Step Verification
                    </OutlinedBlueButton>
                  </Stack>
                </>
              )}
            </div>
            <img
              src="https://www.gstatic.com/identity/accountsettings/strongauth/2SV_scene_hero_v2_light_1daa958040ec3dbd3fa3eef6f0990fa4.svg"
              alt="2-Step Verification Illustration"
              style={{ width: 350, maxWidth: "100%" }}
            />
          </div>
        </Box>

        {/* Authenticator Details Modal */}
        <Modal
          open={showAuthenticatorModal}
          onClose={() => setShowAuthenticatorModal(false)}
        >
          <ModalPaper>
            <TitleTypography variant="h6" fontFamily={"var(--custom-font-family)"}>
              Authenticator app
            </TitleTypography>
            <DescriptionTypography fontFamily={"var(--custom-font-family)"}>
              Instead of waiting for text messages, get verification codes from an
              authenticator app. It works even if your phone is offline.
              <br />
              <br />
              First, download Google Authenticator from the{" "}
              <a
                href="https://play.google.com/store/apps/details?id=com.google.android.apps.authenticator2&pli=1"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#60a5fa", textDecoration: "underline" }}
              >
                Google Play Store
              </a>{" "}
              or the{" "}
              <a
                href="https://apps.apple.com/us/app/google-authenticator/id388497605"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: "#60a5fa", textDecoration: "underline" }}
              >
                iOS App Store
              </a>
              .
            </DescriptionTypography>

            {/* If 2FA already enabled */}
            {user?.twoFactorAuth?.isEnabled ? (
              <TwoFABox>
                <Box display="flex" alignItems="center" gap={2}>
                  <QrCode2Icon sx={{ color: "#94a3b8" }} />
                  <Box>
                    <Typography fontWeight={500} color="#fff">
                      Authenticator
                    </Typography>
                    <Typography color="#94a3b8" fontSize={14}>
                      Added {daysAgo !== null ? `${daysAgo} days ago` : "N/A"}
                    </Typography>
                  </Box>
                </Box>
              </TwoFABox>
            ) : (
              <Box display="flex" justifyContent="end">
                <OutlinedBlueButton
                  variant="outlined"
                  startIcon={<AddIcon />}
                  onClick={handleSetupAuthenticator}
                  disabled={loadingQR}
                >
                  Set up authenticator
                </OutlinedBlueButton>
              </Box>
            )}
          </ModalPaper>
        </Modal>

        {/* QR Setup Modal */}
        <Modal open={showSetupModal} onClose={() => setShowSetupModal(false)}>
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: 350,
              p: 4,
              outline: "none",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              Set up authenticator app
            </Typography>
            <Typography align="left" mb={2}>
              <ul style={{ margin: 0, paddingLeft: 20 }}>
                <li>
                  In the Google Authenticator app, tap the <b>+</b>
                </li>
                <li>
                  Choose <b>Scan a QR code</b>
                </li>
              </ul>
            </Typography>
            {qrCode ? (
              <img
                src={qrCode}
                alt="QR Code"
                style={{ width: 180, height: 180, margin: "0 auto" }}
              />
            ) : (
              <Typography color="text.secondary">Loading QR code...</Typography>
            )}
            {error && (
              <Box color="error.main" mb={2}>
                {error}
              </Box>
            )}
            <Box mt={2} display="flex" justifyContent="space-between">
              <PrimaryButton onClick={() => setShowSetupModal(false)}>
                Cancel
              </PrimaryButton>
              <PrimaryButton
                // variant="outlined"
                onClick={() => {
                  setShowSetupModal(false);
                  setShowOtpVerifyModal(true);
                }}
              >
                Next
              </PrimaryButton>
            </Box>
          </Paper>
        </Modal>

        {/* OTP Verification Modal */}
        <Modal
          open={showOtpVerifyModal}
          onClose={() => setShowOtpVerifyModal(false)}
        >
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: 350,
              p: 4,
              outline: "none",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              Set up authenticator app
            </Typography>
            <Typography mb={2}>
              Enter the 6-digit code that you see in the app
            </Typography>
            <input
              type="text"
              placeholder="Enter code"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              maxLength={6}
              style={{
                padding: 12,
                borderRadius: 4,
                border: "1px solid #ccc",
                width: "92%",
                fontSize: 18,
                marginBottom: 16,
              }}
            />
            {verifyError && (
              <Typography color="error" mb={1}>
                {verifyError}
              </Typography>
            )}
            <Box mt={2} display="flex" justifyContent="space-between">
              <PrimaryButton
                onClick={() => {
                  setShowOtpVerifyModal(false);
                  setShowSetupModal(true);
                }}
              >
                Back
              </PrimaryButton>
              <PrimaryButton
                // variant="outlined"
                onClick={verifyOtp}
                disabled={verifying || otp.length !== 6}
              >
                {verifying ? <CircularProgress size={22} /> : "Verify"}
              </PrimaryButton>
            </Box>
          </Paper>
        </Modal>

        {/* Turn Off Modal */}
        <Modal
          open={showTurnOffModal}
          onClose={() => setShowTurnOffModal(false)}
        >
          <Paper
            sx={{
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              minWidth: 350,
              p: 4,
              outline: "none",
              borderRadius: 2,
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mb={2}>
              Turn off 2-Step Verification
            </Typography>
            <Typography color="text.secondary" mb={2}>
              Enter your current authenticator code to turn off 2-Step
              Verification.
            </Typography>
            <input
              type="text"
              placeholder="Enter OTP"
              value={otpToDisable}
              onChange={(e) => setOtpToDisable(e.target.value)}
              maxLength={6}
              style={{
                padding: 8,
                borderRadius: 4,
                border: "1px solid #ccc",
                width: 180,
                marginBottom: 16,
              }}
            />
            {disableError && (
              <Typography color="error" mb={1}>
                {disableError}
              </Typography>
            )}
            <Box mt={2} display="flex" justifyContent="space-between">
              <PrimaryButton onClick={() => setShowTurnOffModal(false)}>
                Cancel
              </PrimaryButton>
              <PrimaryButton
                variant="contained"
                color="error"
                disabled={disabling || otpToDisable.length !== 6}
                onClick={async () => {
                  setDisabling(true);
                  setDisableError("");
                  try {
                    await api.post(
                      "/security/2fa/disable",
                      { token: otpToDisable },
                      { headers: { Authorization: `Bearer ${token}` } }
                    );
                    setShowTurnOffModal(false);
                    setOtpToDisable("");
                    setEnabledAt(null);
                    await dispatch(
                      updateUserDetails({
                        userData: {
                          id: user?.id,
                          twoFactorAuth: {
                            isEnabled: false,
                            enabledAt: null,
                          }
                        }
                      })
                    ).unwrap();
                    await dispatch(getUserDetails(token));
                  } catch {
                    setDisableError("Invalid OTP. Try again.");
                  }
                  setDisabling(false);
                }}
              >
                {disabling ? "Turning off..." : "Turn off"}
              </PrimaryButton>
            </Box>
          </Paper>
        </Modal>
      </CustomWrapper>
    </Box>
  );
};

export default TwoFactorSettings;
