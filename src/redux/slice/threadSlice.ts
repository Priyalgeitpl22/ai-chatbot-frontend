import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";
import { ThreadType } from "../../enums";

export interface Thread {
  id: string;
  user: string;
  type: ThreadType;
  createdAt: string;
}

interface ThreadState {
  threads: Thread[];
  loading: boolean;
  error: string | null;
}

const initialState: ThreadState = {
  threads: [],
  loading: false,
  error: null,
};

const token = Cookies.get("access_token");

// Thunk to fetch all threads
export const getAllThreads = createAsyncThunk(
  "threads/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/thread", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const threads = response.data?.data?.threads;
      if (!Array.isArray(threads)) {
        return rejectWithValue("Invalid API response format");
      }
      return threads;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Network error");
    }
  }
);

// Thunk to search threads by a query
export const searchThreads = createAsyncThunk(
  "threads/search",
  async (query: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      const response = await api.get(
        `/thread/search?query=${encodeURIComponent(query)}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const threads = response.data?.data?.threads;
      if (!Array.isArray(threads)) {
        return rejectWithValue("Invalid API response format");
      }
      return threads;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || "Network error");
    }
  }
);

const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Handlers for getAllThreads
      .addCase(getAllThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllThreads.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(getAllThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Handlers for searchThreads
      .addCase(searchThreads.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(searchThreads.fulfilled, (state, action: PayloadAction<any[]>) => {
        state.loading = false;
        state.threads = action.payload;
      })
      .addCase(searchThreads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default threadSlice.reducer;
