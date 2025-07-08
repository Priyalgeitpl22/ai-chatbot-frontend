import React, { useEffect, useState } from "react";
import axios from "axios";

interface Props {
  token: string;
}

const TwoFactorSettings: React.FC<Props> = ({ token }) => {
  const [enabled, setEnabled] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [secret, setSecret] = useState("");
  const [otp, setOtp] = useState("");
  const [isSetup, setIsSetup] = useState(false);
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    if (!token) {
      setMsg("User not authenticated.");
      return;
    }

    axios
      .get("/api/security/user/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
          "Cache-Control": "no-cache",
        },
      })
      .then((res) => {
        if (res.data?.user?.enable_2fa !== undefined) {
          setEnabled(res.data.user.enable_2fa);
        } else {
          setMsg("Unexpected profile format.");
        }
      })
      .catch((err) => {
        console.error("User profile fetch error:", err);
        setMsg("Failed to fetch user settings.");
      });
  }, [token]);

  const startSetup = async () => {
    if (!token) {
      setMsg("User not authenticated.");
      return;
    }

    setLoading(true);
    try {
      const res = await axios.get("/api/security/2fa/setup", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setQrCode(res.data.qrCode || "");
      setSecret(res.data.secret || "");
      setIsSetup(true);
      setMsg("");
    } catch (err) {
      console.error("QR code setup error:", err);
      setMsg("Error generating QR code.");
    }
    setLoading(false);
  };

  const verifyOtp = async () => {
    if (!otp || !token) {
      setMsg("Missing OTP or user token.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/security/2fa/verify",
        { token: otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnabled(true);
      setIsSetup(false);
      setMsg("2FA enabled successfully.");
    } catch (err) {
      setMsg("Invalid OTP. Try again.");
    }
    setLoading(false);
  };

  const disable2FA = async () => {
    if (!otp || !token) {
      setMsg("Missing OTP or token.");
      return;
    }

    setLoading(true);
    try {
      await axios.post(
        "/api/security/2fa/disable",
        { token: otp },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setEnabled(false);
      setOtp("");
      setMsg("2FA disabled.");
    } catch (err) {
      setMsg("Invalid OTP. Could not disable.");
    }
    setLoading(false);
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication (2FA)</h2>

      {msg && <p className="text-sm mb-3 text-blue-600">{msg}</p>}

      {enabled ? (
        <>
          <p className="mb-2 text-green-600 font-medium">
            2FA is currently <strong>enabled</strong>.
          </p>
          <label className="block mb-1 font-medium">Enter OTP to disable:</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            className="border p-2 rounded w-full mb-3"
          />
          <button
            onClick={disable2FA}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Disable 2FA
          </button>
        </>
      ) : isSetup ? (
        <>
          <p className="mb-2">Scan this QR code using Google Authenticator or Authy:</p>
          {qrCode ? (
            <div className="flex justify-center mb-3">
              <img src={qrCode} alt="QR Code" className="w-48 h-48" />
            </div>
          ) : (
            <p className="text-sm text-gray-500">Loading QR code...</p>
          )}

          <label className="block mb-1 font-medium">Enter OTP:</label>
          <input
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="6-digit code"
            className="border p-2 rounded w-full mb-3"
          />
          <button
            onClick={verifyOtp}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            Verify & Enable 2FA
          </button>
        </>
      ) : (
        <button
          onClick={startSetup}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Enable 2FA
        </button>
      )}
    </div>
  );
};

export default TwoFactorSettings;