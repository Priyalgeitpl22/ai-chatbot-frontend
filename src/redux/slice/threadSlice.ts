import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";
import { ThreadType } from "../../enums";


export interface Thread {
  id: string;
  user: string;
  aiOrgId: number;
  url: string;
  ip: string;
  name: string;
  email: string;
  type: ThreadType;
  createdAt: string;
  readed: boolean;
  assignedTo:string|null;
  endedBy:string;
  endedAt:Date;
  unseenCount:number|null;
  latestMessage:{content:string}
  status?: string; // Add status property to match backend
}


interface ThreadState {
  threads: Thread[];
  loading: boolean;
  error: string | null;
  summaryData:{[threadId:string] :any};
}

const initialState: ThreadState = {
  threads: [],
  loading: false,
  error: null,
  summaryData:{},
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

// Thunk to assign thread to the agent
export const assignThread = createAsyncThunk(
  "threads/assign",
  async (
    { id, assignedTo }: { id: string; assignedTo: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/thread/${id}/assign`,
        {assignedTo,assign:true} ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.thread;
    } catch (error: any) {
      console.error("Error assigning thread:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error assigning thread"
      );
    }
  }
);

// Thunk to unassign thread to the agent
export const unassignThread = createAsyncThunk(
  "threads/unassign",
  async (
    { id}: { id: string;},
    { rejectWithValue }
  ) => {
    try {
      const response = await api.patch(
        `/thread/${id}/assign`,
        {assign:false} ,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      return response.data.thread;
    } catch (error: any) {
      console.error("Error unassigning thread:", error);
      return rejectWithValue(
        error.response?.data?.message || "Error unassigning thread"
      );
    }
  }
);

// thunk to read the thread
export const readThread  = createAsyncThunk(
  "threads/read",
  async({id}:{id:string},{rejectWithValue})=>{
    try{

      const response = await api.patch(`/thread/${id}/readed`,{},{
        headers:{Authorization: `Bearer ${token}` }
      })
      return response.data.message;

    }catch(error:any){
      console.error("Error reading thread",error)
      return rejectWithValue(
        error.response?.data?.message || "Error unassigning thread"
      );
    }
  }
)

export const chatSummaryData = createAsyncThunk(
  "thread/chatSummaryData",
  async (threadId: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      const response = await api.get(`/chat/analyze/${threadId}/summary`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch chat summary."
      );
    }
  }
);

const threadSlice = createSlice({
  name: "threads",
  initialState,
  reducers: {
    updateThread: (state, action: PayloadAction<Thread>) => {
  const updated = action.payload;
  const index = state.threads.findIndex((t) => t.id === updated.id);
  if (index !== -1) {
    state.threads[index] = updated; 
  }
},
   readThreads: (state, action: PayloadAction<string>) => {
  const threadId = action.payload;
  const index = state.threads.findIndex(thread => thread.id == threadId);
  if (index!==-1) {
    state.threads[index].readed = true;
    state.threads[index].unseenCount=0;
  } else {
    console.warn(`Thread with ID "${threadId}" not found.`);
  }
},
addThread: (state, action: PayloadAction<Thread>) => {
  const threadData = action.payload
  threadData.unseenCount=0
  state.threads.unshift(action.payload);
},
newMessage:(state,action:PayloadAction<{latestMessage:string,threadId:string}>)=>{
  const updated = action.payload.threadId;
  const index = state.threads.findIndex((t) => t.id === updated);
  if(state.threads[index].unseenCount != null && state.threads[index].unseenCount === 0) {
    state.threads[index].unseenCount+=1
  }else if(state.threads[index].unseenCount != null ){
     state.threads[index].unseenCount+=2
  }
  state.threads[index].latestMessage={content:action.payload.latestMessage}
}
  },
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
      })
      // Handle chatSummaryData
      .addCase(chatSummaryData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(chatSummaryData.fulfilled, (state, action) => {
        state.loading = false;
        const threadId = action.meta.arg;
        state.summaryData[threadId] = action.payload;
      })
      .addCase(chatSummaryData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default threadSlice.reducer;
export const { updateThread ,addThread,newMessage,readThreads } = threadSlice.actions;
