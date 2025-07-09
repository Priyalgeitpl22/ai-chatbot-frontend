import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";

export interface Notifications {
  id: string | null ;
  message: string[];
  latest: string;
  orgId: string;
  read: boolean;
  threadId: string;
  notification: boolean;
}

interface NotificationsState {
  notification: Notifications[];
  loading: boolean;
  error: string | null;
  count: number;
}

const initialState: NotificationsState = {
  notification: [],
  loading: false,
  error: null,
  count: 0,
};

const token = Cookies.get("access_token");

export const getNotifications = createAsyncThunk(
  "get/notification",
  async (orgId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`notification/${orgId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      return {
        data: response.data.data,
        count: response.data.count,
      };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);
export const clearCount = createAsyncThunk(
  "clear/notification",
  async (threadId: string[], { rejectWithValue }) => {
    try {
      const response = await api.post(
        `notification/clear`,
        { threadId },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to fetch notifications"
      );
    }
  }
);

export const clearNotification = createAsyncThunk(
  "delete/notification",
  async (orgId: string, { rejectWithValue }) => {
    try {
      const response = await api.delete(`notification/${orgId}/notification`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data || "Failed to delete notifications"
      );
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    addNewNotification: (state, action: PayloadAction<Notifications>) => {
      state.notification.push(action.payload);
    },
    handleCount: (state, action: PayloadAction<number>) => {
      if (action.payload === 0) {
        state.count = action.payload;
      } else {
        if (state.count >= 0) {
          state.count = action.payload + state.count;
        }
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        getNotifications.fulfilled,
        (
          state,
          action: PayloadAction<{ data: Notifications[]; count: number }>
        ) => {
          state.loading = false;
          state.notification = action.payload.data;
          state.count = action.payload.count;
        }
      )
      .addCase(getNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(clearNotification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(clearNotification.fulfilled, (state) => {
        state.loading = false;
        state.error = null;
        state.count = 0;
        state.notification = [];
      })
      .addCase(clearNotification.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addNewNotification, handleCount } = notificationSlice.actions;
export default notificationSlice.reducer;
