import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";

interface AuthState {
  user: {
    id: string;
    fullName: string;
    email: string;
    orgId: string;
    aiOrgId: string;
    profilePicture: string;
    role: string;
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: boolean | null;
}
interface ResetPasswordData {
  email: string;
  token: string;
  password: string;
}

interface ForgetPasswordData {
  email: string;
}
interface LoginData {
  email: string;
  password: string;
}
interface OtpData {
  email: string;
  otp: string;
}
interface ResetPasswordData {
  email: string;
}
interface ChangePasswordData {
  email: string;
  existingPassword: string;
  newPassword: string;
}

const token = Cookies.get("access_token");

export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", 
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error"
      );
    }
  }
);

export const activateAccount = createAsyncThunk(
  "auth/activate",
  async (data: any, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/activate", data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data || error.message || "Network error"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData: OtpData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", otpData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error"
      );
    }
  }
);

export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (data: ChangePasswordData, { rejectWithValue }) => {
    try {
      if (!token) throw new Error("No authentication token found");

      const response = await api.post("/auth/change-password", data, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.status !== 200) {
        throw new Error(response.data?.message || "Failed to change password");
      }
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error"
      );
    }
  }
);

export const loginUser = createAsyncThunk(
  "auth/login",
  async (loginData: LoginData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/login", loginData);
      const { token } = response.data;
      Cookies.set("access_token", token, { expires: 7, path: "" });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error"
      );
    }
  }
);

export const logoutUser = createAsyncThunk(
  "auth/logout",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      if (!token) throw new Error("No authentication token found");

      await api.post("/auth/logout", {}, { headers: { Authorization: `Bearer ${token}` } });
      Cookies.remove("access_token");
      return { success: true };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Logout failed"
      );
    }
  }
);

export const forgetPassword = createAsyncThunk(
  "auth/forget-password",
  async (data: ForgetPasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/forget-password`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to send forget password email");
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/reset-password",
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/auth/reset-password`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to reset password");
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    token: Cookies.get("access_token") ?? null,
    loading: false,
    error: null,
    success: null,
  } as AuthState,
  reducers: {
    resetSuccessState: (state) => {
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        }
      })
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(loginUser.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.token = action.payload.token;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        }
      })
      .addCase(logoutUser.pending, (state) => {
        state.loading = true;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        Cookies.remove("access_token");
      })
      .addCase(logoutUser.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        }
      })
      .addCase(forgetPassword.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(forgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.loading = true;
      })
      .addCase(verifyOtp.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        }
      })
      .addCase(resetPassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(resetPassword.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        }
      })
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        }
      })
      .addCase(activateAccount.pending, (state) => {
        state.loading = true;
        state.success = null;
      })
      .addCase(activateAccount.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(activateAccount.rejected, (state, action) => {
        state.loading = false;
        state.success = null;
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        }
      })
  },
});

export const { resetSuccessState } = authSlice.actions;
export default authSlice.reducer;
