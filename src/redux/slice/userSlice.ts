import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";

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
  success: string | null;
  passwordChangeSuccess: boolean;
}

// Updated registerUser thunk to accept FormData
export const registerUser = createAsyncThunk(
  "auth/register",
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/register", formData, {
        headers: { "Content-Type": "multipart/form-data" },
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
        headers: { "Content-Type": "application/json" },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error?.response?.data?.message || error.message || "Network error"
      );
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async (otpData: OtpData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/verify-otp", otpData);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Network error"
      );
    }
  }
);

export const resetPassword = createAsyncThunk(
  "auth/resetPassword",
  async (data: ResetPasswordData, { rejectWithValue }) => {
    try {
      const response = await api.post("/auth/resetPassword", data);
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
      const token = Cookies.get("access_token");
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

export const getUserDetails = createAsyncThunk(
  "auth/getUserDetails",
  async (_, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      if (!token) throw new Error("No authentication token found");

      const response = await api.get("/user", {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch user details"
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

const userSlice = createSlice({
  name: "user",
  initialState: {
    user: null,
    token: Cookies.get("access_token") ?? null,
    loading: false,
    error: null,
    success: null,
    passwordChangeSuccess: false,
  } as AuthState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
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
      .addCase(getUserDetails.pending, (state) => {
        state.loading = true;
      })
      .addCase(getUserDetails.fulfilled, (state, action: PayloadAction<any>) => {
        state.loading = false;
        state.user = action.payload;
      })
      .addCase(getUserDetails.rejected, (state, action) => {
        state.loading = false;
        if (action.payload) {
          state.error = action.payload as string;
        } else if (action.error.message) {
          state.error = action.error.message;
        }
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
      .addCase(resetPassword.pending, (state) => {
        state.loading = true;
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
      .addCase(changePassword.pending, (state) => {
        state.loading = true;
        state.passwordChangeSuccess = false;
      })
      .addCase(changePassword.fulfilled, (state) => {
        state.loading = false;
        state.passwordChangeSuccess = true;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.loading = false;
        state.passwordChangeSuccess = false;
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
        state.success = "Account activated successfully!";
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

export const { logout } = userSlice.actions;
export default userSlice.reducer;
