import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";

export interface Task {
  id: string;
  name: string;
  email: string;
  userId: string;
  orgId: string;
  threadId: string;
  query: string;
  assignedTo?: string;
  status: "pending" | "in-progress" | "completed";
  priority: "low" | "medium" | "high";
  createdAt: string;
  updatedAt: string;
}

interface TaskState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  unreadCount: number;
}

const initialState: TaskState = {
  tasks: [],
  loading: false,
  error: null,
  unreadCount: 0,
};

const token = Cookies.get("access_token");

export const getAllTasks = createAsyncThunk(
  "tasks/getAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/task/tasks", {
        headers: { Authorization: `Bearer ${token}` },
      });
      const tasks = response.data?.tasks;
      if (!Array.isArray(tasks)) {
        return rejectWithValue("Invalid API response format");
      }
      return tasks;
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data?.message || "Network error");
    }
  }
);

export const assignTask = createAsyncThunk(
  "tasks/assignTask",
  async (
    { id, assignedTo }: { id: string; assignedTo: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(`/task/tasks/${id}/assign`, { assignedTo ,assign:true},{
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data.task;
    } catch (error: any) {
      console.error("Error assigning task:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error assigning task"
      );
    }
  }
);

// Thunk to unassign thask to the agent
export const unassignTask = createAsyncThunk(
  "task/unassignTask",
  async (
    { id}: { id: string},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/task/tasks/${id}/assign`,
        {assign:false} ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.task;
    } catch (error: any) {
      console.error("Error unassigning task:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error unassigning task"
      );
    }
  }
);

export const fetchUnreadTaskCount = createAsyncThunk<
  number,
  string,
  { rejectValue: string }
>("tasks/fetchUnreadTaskCount", async (orgId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/task/unread/${orgId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Assuming the API returns { count: number }
    return response.data.count;
  } catch (error: any) {
    return rejectWithValue("Failed to fetch unread task count");
  }
});

const taskSlice = createSlice({
  name: "tasks",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getAllTasks.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getAllTasks.fulfilled, (state, action: PayloadAction<Task[]>) => {
        state.loading = false;
        state.tasks = action.payload;
      })
      .addCase(getAllTasks.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(assignTask.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(assignTask.fulfilled, (state, action: PayloadAction<Task>) => {
        state.loading = false;
        const index = state.tasks.findIndex((task) => task.id === action.payload.id);
        if (index !== -1) {
          state.tasks[index] = action.payload;
        }
      })
      .addCase(assignTask.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchUnreadTaskCount.fulfilled, (state, action: PayloadAction<number>) => {
        state.unreadCount = action.payload;
      });
  },
});

export default taskSlice.reducer;
