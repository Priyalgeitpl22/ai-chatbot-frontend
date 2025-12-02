import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import Cookies from "js-cookie";
import { ChatBotSettings } from "../../components/AI-Settings/Configuration/Configuration";

interface Chat {
  id: string;
  threadId: string;
  sender: string;
  content: string;
  createdAt: string;
  fileUrl?: string;
  fileType?: string;
  fileName?: string;
}

interface chatState {
  chats: Chat[];
  chatConfig: any;
  loading: boolean;
  error: string | null;
}

const initialState: chatState = {
  chats: [],
  loading: false,
  error: null,
  chatConfig:null
};

const token = Cookies.get("access_token");

export const getChats = createAsyncThunk(
  "chats/getchats",
  async (threadId: string, { rejectWithValue }) => {
    try {
      const response = await api.get(`/message/${threadId}`, {
        headers: { Authorization: `Bearer ${token}`}
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch chats");
    }
  }
);

// thuk for message seen  
export const seenMessage = createAsyncThunk(
  "messsage/seen",
  async({id}:{id:string},{rejectWithValue})=>{
    try{
      const response  = await api.patch(`/message/${id}/seen`,{},{
        headers: { Authorization: `Bearer ${token}`}
      })
      return response.data.message
    }catch(error:any){
      console.error("Error reading thread",error)
      return rejectWithValue(
        error.response?.data?.message || "Error unassigning thread"
      );
    }
  }
)
// thunk for sending the chat email transcribe
export const sendChatTranscriptEmail = createAsyncThunk(
  "chat/transcript",
  async (
    {
      threadId,
      email,
      cc,
      bcc,
    }: { threadId: string; email: string; cc?: string[]; bcc?: string[] },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.post(
        `/chat/config/chats/transcript`,
        {
          thread_id: threadId,
          email,
          cc,   
          bcc,  
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      return response.data.message;
    } catch (error: any) {
      console.error("Error sending transcript", error);
      return rejectWithValue(
        error.response?.data?.message || "Error sending transcript"
      );
    }
  }
);


export const getChatConfig = createAsyncThunk(
  "chat/getChatConfig",
  async (orgId: string, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      if (!token) return rejectWithValue("No authentication token found");

      const response = await api.get(`/chat/config?orgId=${orgId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return response.data?.data || {};
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to fetch chat configuration");
    }
  }
);

export const getScript = createAsyncThunk(
  "getScript",
  async (orgId:string|undefined, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      if (!token) return rejectWithValue("No authentication token found");

      const response = await api.get(`/chat/config/script/${orgId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", 
        },
      });

      return response.data?.data || {};
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || "Failed to fetch script");
    }
  }
);

export const saveConfigurations = createAsyncThunk(
  "saveConfigurations",
  async (settings: ChatBotSettings, { rejectWithValue }) => {
    try {
      const token = Cookies.get("access_token");
      if (!token) return rejectWithValue("No authentication token found");

      const response = await api.post(`/chat/config`, settings, { 
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data", 
        },
      });

      return response.data || {};
    } catch (error: any) {
      console.error("API Error:", error);
      return rejectWithValue(error.response?.data || "Failed to save configurations");
    }
  }
);

export const uploadChatFile = createAsyncThunk(
  "chats/uploadChatFile",
  async (file: File, { rejectWithValue }) => {
    try {
      const formData = new FormData();
      formData.append("chatFile", file);
      const response = await api.post("/message/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return response.data.data;
    } catch (error: any) {
      return rejectWithValue(error.response?.data || "Failed to upload file");
    }
  }
);

const chatSlice = createSlice({
  name: "chats",
  initialState,
  reducers: {
    addchat: (state, action: PayloadAction<Chat>) => {
      const msg = action.payload;
      if (msg.fileUrl) {
        if (
          msg.content === msg.fileName ||
          (msg.content && msg.content.startsWith("File Uploaded:"))
        ) {
          return;
        }
      }
      if ((msg.content && msg.content.trim() !== "") || msg.fileUrl) {
        state.chats.push(msg);
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(getChats.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getChats.fulfilled, (state, action: PayloadAction<Chat[]>) => {
        state.loading = false;
        state.chats = action.payload;
      })
      .addCase(getChats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(getChatConfig.pending, (state) => {
        state.loading = true;
      })
      .addCase(getChatConfig.fulfilled, (state, action) => {
        state.loading = false;
        state.chatConfig = action.payload;
      })
      .addCase(getChatConfig.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { addchat } = chatSlice.actions;
export default chatSlice.reducer;
