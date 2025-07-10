import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

interface SecurityState {
  is2FAEnabled: boolean;
  qrCode: string | null;
  loading: boolean;
  error: string | null;
  message: string | null;
}

interface UserProfileResponse {
  user: {
    enable_2fa: boolean;
  };
}

interface Setup2FAResponse {
  qrCode: string;
}

interface Verify2FAResponse {
  token?: string;
  message: string;
}

interface Disable2FAResponse {
  message: string;
}

const token = Cookies.get("access_token");

// Fetch user security profile
export const fetchUserSecurityProfile = createAsyncThunk<
  UserProfileResponse,
  string,
  { rejectValue: string }
>("security/fetchUserProfile", async (token, { rejectWithValue }) => {
  try {
    const response = await api.get("/security/user/profile", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Cache-Control": "no-cache",
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Failed to fetch user settings";
    if (error instanceof AxiosError) {
      errorMessage = (error.response?.data as string) || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// Setup 2FA
export const setup2FA = createAsyncThunk<
  Setup2FAResponse,
  string,
  { rejectValue: string }
>("security/setup2FA", async (token, { rejectWithValue }) => {
  ;
  try {
    const response = await api.get("/security/2fa/setup", {
      headers: {
        Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6Ijk0YTg1MWUzLTZhNmYtNGQxZi04MjExLTE3ZDU2NmMzZmU0YiIsInJvbGUiOiJBZ2VudCIsImlhdCI6MTc1MjA5MTU0NSwiZXhwIjoxNzUyMDk1MTQ1fQ.OTDJubZHOBXRtGPIjNISoM03OodUOp5VBgcWopoy4mg`,
      },
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Error generating QR code";
    if (error instanceof AxiosError) {
      errorMessage = (error.response?.data as string) || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// Verify 2FA during setup
export const verify2FASetup = createAsyncThunk<
  Verify2FAResponse,
  { token: string; otp: string },
  { rejectValue: string }
>("security/verify2FASetup", async ({ token, otp }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      "/security/2fa/verify",
      { token: otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Invalid OTP. Try again";
    if (error instanceof AxiosError) {
      errorMessage = (error.response?.data as string) || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// Verify 2FA during login
export const verify2FALogin = createAsyncThunk<
  Verify2FAResponse,
  { tempToken: string; otp: string },
  { rejectValue: string }
>("security/verify2FALogin", async ({ tempToken, otp }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      "/security/2fa/verify2FADuringLogin",
      { otp, temp_token: tempToken },
      {
        headers: {
          Authorization: `Bearer ${tempToken}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Invalid OTP or 2FA failed";
    if (error instanceof AxiosError) {
      errorMessage = (error.response?.data as string) || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// Disable 2FA
export const disable2FA = createAsyncThunk<
  Disable2FAResponse,
  { token: string; otp: string },
  { rejectValue: string }
>("security/disable2FA", async ({ token, otp }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      "/security/2fa/disable",
      { token: otp },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Invalid OTP. Could not disable";
    if (error instanceof AxiosError) {
      errorMessage = (error.response?.data as string) || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

const initialState: SecurityState = {
  is2FAEnabled: false,
  qrCode: null,
  loading: false,
  error: null,
  message: null,
};

const securitySlice = createSlice({
  name: "security",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    clearMessage: (state) => {
      state.message = null;
    },
    setQrCode: (state, action: PayloadAction<string | null>) => {
      state.qrCode = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch user profile
      .addCase(fetchUserSecurityProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSecurityProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.is2FAEnabled = action.payload.user.enable_2fa;
      })
      .addCase(fetchUserSecurityProfile.rejected, (state, action) => {
        state.loading = false;
        // If error is an object, try to extract a message, else fallback
        if (action.payload && typeof action.payload === 'object') {
          state.error = (action.payload as any).message || JSON.stringify(action.payload);
        } else {
          state.error = action.payload || "Failed to fetch user settings";
        }
      })
      // Setup 2FA
      .addCase(setup2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(setup2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.qrCode = action.payload.qrCode;
      })
      .addCase(setup2FA.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === 'object') {
          state.error = (action.payload as any).message || JSON.stringify(action.payload);
        } else {
          state.error = action.payload || "Error generating QR code";
        }
      })
      // Verify 2FA setup
      .addCase(verify2FASetup.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verify2FASetup.fulfilled, (state, action) => {
        state.loading = false;
        state.is2FAEnabled = true;
        state.qrCode = null;
        state.message = "2FA enabled successfully";
      })
      .addCase(verify2FASetup.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === 'object') {
          state.error = (action.payload as any).message || JSON.stringify(action.payload);
        } else {
          state.error = action.payload || "Invalid OTP. Try again";
        }
      })
      // Verify 2FA login
      .addCase(verify2FALogin.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(verify2FALogin.fulfilled, (state, action) => {
        state.loading = false;
        state.message = "Login successful";
      })
      .addCase(verify2FALogin.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === 'object') {
          state.error = (action.payload as any).message || JSON.stringify(action.payload);
        } else {
          state.error = action.payload || "Invalid OTP or 2FA failed";
        }
      })
      // Disable 2FA
      .addCase(disable2FA.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(disable2FA.fulfilled, (state, action) => {
        state.loading = false;
        state.is2FAEnabled = false;
        state.message = "2FA disabled";
      })
      .addCase(disable2FA.rejected, (state, action) => {
        state.loading = false;
        if (action.payload && typeof action.payload === 'object') {
          state.error = (action.payload as any).message || JSON.stringify(action.payload);
        } else {
          state.error = action.payload || "Invalid OTP. Could not disable";
        }
      });
  },
});

export const { clearError, clearMessage, setQrCode } = securitySlice.actions;
export default securitySlice.reducer; 