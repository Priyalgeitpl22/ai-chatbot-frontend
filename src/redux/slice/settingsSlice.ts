import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import Cookies from "js-cookie";
import api from "../../services/api";

interface NotificationSettings {
  selectedSound: string;
  isSoundOn: boolean;
}

interface UserSettings {
  userId: string;
  notification: NotificationSettings;
}

interface SettingsState {
  settings: UserSettings | null;
  loading: boolean;
  error: string | null;
}

const initialState: SettingsState = {
  settings: null,
  loading: false,
  error: null,
};

const token = Cookies.get("access_token");

// 🔄 Async thunk to fetch settings
export const fetchUserSettings = createAsyncThunk(
  "settings/fetchUserSettings",
  async (userId: string, thunkAPI) => {
    try {
      const res = await api.get(`/user/user-settings/${userId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to fetch user settings"
      );
    }
  }
);

// 📝 Async thunk to save settings
export const saveUserSettings = createAsyncThunk(
  "settings/saveUserSettings",
  async (
    {
      userId,
      category,
      data,
    }: { userId: string; category: string; data: any },
    thunkAPI
  ) => {
    try {
      const res = await api.post(
        "/user/user-settings",
        { userId, category, data },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return res.data;
    } catch (error: any) {
      return thunkAPI.rejectWithValue(
        error.response?.data?.message || "Failed to save settings"
      );
    }
  }
);

const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserSettings.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSettings.fulfilled, (state, action) => {
        state.loading = false;
        state.settings = {
          userId: action.payload.userId,
          ...action.payload.settings,
        };
      })
      .addCase(fetchUserSettings.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(saveUserSettings.fulfilled, (state, action) => {
        state.settings = {
          userId: action.payload.userId,
          ...action.payload.settings,
        };
      });
  },
});

export default settingsSlice.reducer;
