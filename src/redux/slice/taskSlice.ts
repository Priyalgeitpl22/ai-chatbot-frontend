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
}

const initialState: TaskState = {
    tasks: [],
    loading: false,
    error: null,
};

const token = Cookies.get("access_token");

// Fetch all tasks
export const getAllTasks = createAsyncThunk(
    "tasks/getAll",
    async (_, { rejectWithValue }) => {
        try {
            const response = await api.get("/task/tasks", {
                headers: { Authorization: `Bearer ${token}` },
            });

            console.log("API Response:", response.data);

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
            });
    },
});

export default taskSlice.reducer;
