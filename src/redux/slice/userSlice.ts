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
    online: boolean;
    userSettings: {
      settings: {
        notification: {
          selectedSound: string;
          isSoundOn: boolean;
        };   
        };
      };
  } | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  success: string | null;
  passwordChangeSuccess: boolean;
}

export const getUserDetails = createAsyncThunk(
  "auth/getUserDetails",
  async (token: string, { rejectWithValue }) => {
    try {
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

export const updateUserDetails = createAsyncThunk(
  "auth/updateUserDetails",
  async ({ userData }: { userData: any }, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      const response = await api.put("/user", userData, {
        headers: { "Content-Type": "multipart/form-data", Authorization: `Bearer ${token}` },
      });
      return response.data.user;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user details"
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
  },
});

export const { logout } = userSlice.actions;
export default userSlice.reducer;
