import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../redux/store/store";
import {
  fetchUserSecurityProfile,
  setup2FA,
  verify2FASetup,
  disable2FA,
  clearError,
  clearMessage,
} from "../../../redux/slice/securitySlice";

interface Props {
  token: string;
}

const TwoFactorSettings: React.FC<Props> = ({ token }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { is2FAEnabled, qrCode, loading, error, message } = useSelector(
    (state: RootState) => state.security
  );
  
  const [otp, setOtp] = useState("");
  const [isSetup, setIsSetup] = useState(false);

  useEffect(() => {
    if (!token) {
      return;
    }

    dispatch(fetchUserSecurityProfile(token));
  }, [dispatch, token]);

  useEffect(() => {
    if (error) {
      // Clear error after 5 seconds
      const timer = setTimeout(() => {
        dispatch(clearError());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [error, dispatch]);

  useEffect(() => {
    if (message) {
      // Clear message after 5 seconds
      const timer = setTimeout(() => {
        dispatch(clearMessage());
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, dispatch]);

  const startSetup = async () => {
    if (!token) {
      return;
    }

    try {
      await dispatch(setup2FA(token)).unwrap();
      setIsSetup(true);
    } catch (err) {
      debugger
    }
  };

  const verifyOtp = async () => {
    if (!otp || !token) {
      return;
    }

    try {
      await dispatch(verify2FASetup({ token, otp })).unwrap();
      setIsSetup(false);
      setOtp("");
    } catch (err) {
      // Error is handled by the slice
    }
  };

  const disable2FAHandler = async () => {
    if (!otp || !token) {
      return;
    }

    try {
      await dispatch(disable2FA({ token, otp })).unwrap();
      setOtp("");
    } catch (err) {
      // Error is handled by the slice
    }
  };

  return (
    <div className="p-4 border rounded-xl bg-white shadow-sm max-w-lg mx-auto mt-6">
      <h2 className="text-xl font-semibold mb-4">Two-Factor Authentication (2FA)</h2>

      {message && <p className="text-sm mb-3 text-green-600">{message}</p>}
      {error && <p className="text-sm mb-3 text-red-600">{error}</p>}

      {is2FAEnabled ? (
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
            onClick={disable2FAHandler}
            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
            disabled={loading}
          >
            {loading ? "Disabling..." : "Disable 2FA"}
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
            {loading ? "Verifying..." : "Verify & Enable 2FA"}
          </button>
        </>
      ) : (
        <button
          onClick={startSetup}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          {loading ? "Setting up..." : "Enable 2FA"}
        </button>
      )}
    </div>
  );
};

export default TwoFactorSettings;