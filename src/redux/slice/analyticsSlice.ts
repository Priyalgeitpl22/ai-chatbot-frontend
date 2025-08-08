import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface DashboardStats {
  totalChats: { value: number; trend: string };
  agentChats: { value: number; trend: string };
  aiChats: { value: number; trend: string };
  completedChats: { value: number; trend: string };
}

interface ChatVolumeData {
  date: string;
  total: number;
  ai: number;
  agent: number;
}

interface EffectivenessData {
  name: string;
  value: number;
}

interface ChatStatusData {
  status: string;
  count: number;
}

interface TopIntentData {
  intent: string;
  count: number;
  percentage: string;
}

interface TopIntentsResponse {
  intents: TopIntentData[];
  total: number;
}

interface SatisfactionScoreData {
  score: number;
  count: number;
  emoji: string;
}

interface SatisfactionResponse {
  averageScore: string;
  scoreBreakdown: SatisfactionScoreData[];
  totalChats: number;
}

interface EmailTranscriptData {
  id: string;
  email: string;
  name: string;
  status: string;
  type: string;
  createdAt: string;
  endedAt: string;
}

interface EmailTranscriptResponse {
  count: number;
  detailedData: EmailTranscriptData[] | null;
}

interface AnalyticsState {
  // Dashboard Stats
  dashboardStats: DashboardStats | null;
  dashboardStatsLoading: boolean;
  dashboardStatsError: string | null;

  // Chat Volume Data
  chatVolumeData: ChatVolumeData[];
  chatVolumeLoading: boolean;
  chatVolumeError: string | null;

  // AI Effectiveness Data
  aiEffectivenessData: EffectivenessData[];
  aiEffectivenessLoading: boolean;
  aiEffectivenessError: string | null;

  // Chat Status Data
  chatStatusData: ChatStatusData[];
  chatStatusLoading: boolean;
  chatStatusError: string | null;

  // Top Intents Data
  topIntentsData: TopIntentsResponse | null;
  topIntentsLoading: boolean;
  topIntentsError: string | null;

  // Satisfaction Data
  satisfactionData: SatisfactionResponse | null;
  satisfactionLoading: boolean;
  satisfactionError: string | null;

  // Email Transcript Data
  emailTranscriptData: EmailTranscriptResponse | null;
  emailTranscriptLoading: boolean;
  emailTranscriptError: string | null;
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  dashboardStatsLoading: false,
  dashboardStatsError: null,
  chatVolumeData: [],
  chatVolumeLoading: false,
  chatVolumeError: null,
  aiEffectivenessData: [],
  aiEffectivenessLoading: false,
  aiEffectivenessError: null,
  chatStatusData: [],
  chatStatusLoading: false,
  chatStatusError: null,
  topIntentsData: null,
  topIntentsLoading: false,
  topIntentsError: null,
  satisfactionData: null,
  satisfactionLoading: false,
  satisfactionError: null,
  emailTranscriptData: null,
  emailTranscriptLoading: false,
  emailTranscriptError: null,
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetchDashboardStats: Making API call to /analytics?type=stats");
      const response = await api.get('/analytics?type=stats');
      console.log("fetchDashboardStats: API response:", response.data);
      
      if (response.data.code === 200) {
        console.log("fetchDashboardStats: Success, returning data:", response.data.data);
        return response.data.data;
      } else {
        console.log("fetchDashboardStats: API returned error code:", response.data.code);
        return rejectWithValue('Failed to fetch dashboard stats');
      }
    } catch (error: any) {
      console.error("fetchDashboardStats: API call failed:", error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching dashboard stats');
    }
  }
);

export const fetchChatVolumeData = createAsyncThunk(
  'analytics/fetchChatVolumeData',
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetchChatVolumeData: Making API call to /analytics?type=chat-volume");
      const response = await api.get('/analytics?type=chat-volume');
      console.log("fetchChatVolumeData: API response:", response.data);
      
      if (response.data.code === 200) {
        console.log("fetchChatVolumeData: Success, returning data:", response.data.data);
        return response.data.data;
      } else {
        console.log("fetchChatVolumeData: API returned error code:", response.data.code);
        return rejectWithValue('Failed to fetch chat volume data');
      }
    } catch (error: any) {
      console.error("fetchChatVolumeData: API call failed:", error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching chat volume data');
    }
  }
);

export const fetchAIEffectivenessData = createAsyncThunk(
  'analytics/fetchAIEffectivenessData',
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetchAIEffectivenessData: Making API call to /analytics?type=ai-effectiveness");
      const response = await api.get('/analytics?type=ai-effectiveness');
      console.log("fetchAIEffectivenessData: API response:", response.data);
      
      if (response.data.code === 200) {
        console.log("fetchAIEffectivenessData: Success, returning data:", response.data.data);
        return response.data.data;
      } else {
        console.log("fetchAIEffectivenessData: API returned error code:", response.data.code);
        return rejectWithValue('Failed to fetch AI effectiveness data');
      }
    } catch (error: any) {
      console.error("fetchAIEffectivenessData: API call failed:", error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching AI effectiveness data');
    }
  }
);

export const fetchChatStatusData = createAsyncThunk(
  'analytics/fetchChatStatusData',
  async (params: { startDate?: string; endDate?: string } = {}, { rejectWithValue }) => {
    try {
      console.log("fetchChatStatusData: Making API call to /analytics?type=chat-status-breakdown");
      const queryParams = new URLSearchParams({ type: 'chat-status-breakdown' });
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      
      const response = await api.get(`/analytics?${queryParams.toString()}`);
      console.log("fetchChatStatusData: API response:", response.data);
      
      if (response.data.code === 200) {
        console.log("fetchChatStatusData: Success, returning data:", response.data.data);
        return response.data.data;
      } else {
        console.log("fetchChatStatusData: API returned error code:", response.data.code);
        return rejectWithValue('Failed to fetch chat status data');
      }
    } catch (error: any) {
      console.error("fetchChatStatusData: API call failed:", error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching chat status data');
    }
  }
);

export const fetchTopIntentsData = createAsyncThunk(
  'analytics/fetchTopIntentsData',
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetchTopIntentsData: Making API call to /analytics?type=top-chat-intents");
      const response = await api.get('/analytics?type=top-chat-intents');
      console.log("fetchTopIntentsData: API response:", response.data);
      
      if (response.data.code === 200) {
        console.log("fetchTopIntentsData: Success, returning data:", response.data.data);
        return response.data.data;
      } else {
        console.log("fetchTopIntentsData: API returned error code:", response.data.code);
        return rejectWithValue('Failed to fetch top intents data');
      }
    } catch (error: any) {
      console.error("fetchTopIntentsData: API call failed:", error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching top intents data');
    }
  }
);

export const fetchSatisfactionData = createAsyncThunk(
  'analytics/fetchSatisfactionData',
  async (_, { rejectWithValue }) => {
    try {
      console.log("fetchSatisfactionData: Making API call to /analytics?type=customer-satisfaction");
      const response = await api.get('/analytics?type=customer-satisfaction');
      console.log("fetchSatisfactionData: API response:", response.data);
      
      if (response.data.code === 200) {
        console.log("fetchSatisfactionData: Success, returning data:", response.data.data);
        return response.data.data;
      } else {
        console.log("fetchSatisfactionData: API returned error code:", response.data.code);
        return rejectWithValue('Failed to fetch satisfaction data');
      }
    } catch (error: any) {
      console.error("fetchSatisfactionData: API call failed:", error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching satisfaction data');
    }
  }
);

export const fetchEmailTranscriptData = createAsyncThunk(
  'analytics/fetchEmailTranscriptData',
  async (params: { startDate?: string; endDate?: string; download?: boolean } = {}, { rejectWithValue }) => {
    try {
      console.log("fetchEmailTranscriptData: Making API call to /analytics?type=email-transcript-count");
      const queryParams = new URLSearchParams({ type: 'email-transcript-count' });
      if (params.startDate) queryParams.append('startDate', params.startDate);
      if (params.endDate) queryParams.append('endDate', params.endDate);
      if (params.download) queryParams.append('download', params.download.toString());
      
      const response = await api.get(`/analytics?${queryParams.toString()}`);
      console.log("fetchEmailTranscriptData: API response:", response.data);
      
      if (response.data.code === 200) {
        console.log("fetchEmailTranscriptData: Success, returning data:", response.data.data);
        return response.data.data;
      } else {
        console.log("fetchEmailTranscriptData: API returned error code:", response.data.code);
        return rejectWithValue('Failed to fetch email transcript data');
      }
    } catch (error: any) {
      console.error("fetchEmailTranscriptData: API call failed:", error);
      return rejectWithValue(error.response?.data?.message || 'Error fetching email transcript data');
    }
  }
);

// Slice
const analyticsSlice = createSlice({
  name: 'analytics',
  initialState,
  reducers: {
    clearAnalyticsErrors: (state) => {
      state.dashboardStatsError = null;
      state.chatVolumeError = null;
      state.aiEffectivenessError = null;
      state.topIntentsError = null;
      state.satisfactionError = null;
      state.emailTranscriptError = null;
    },
    clearDashboardStats: (state) => {
      state.dashboardStats = null;
      state.dashboardStatsError = null;
    },
    clearChatVolumeData: (state) => {
      state.chatVolumeData = [];
      state.chatVolumeError = null;
    },
    clearAIEffectivenessData: (state) => {
      state.aiEffectivenessData = [];
      state.aiEffectivenessError = null;
    },
    clearChatStatusData: (state) => {
      state.chatStatusData = [];
      state.chatStatusError = null;
    },
    clearTopIntentsData: (state) => {
      state.topIntentsData = null;
      state.topIntentsError = null;
    },
    clearSatisfactionData: (state) => {
      state.satisfactionData = null;
      state.satisfactionError = null;
    },
    clearEmailTranscriptData: (state) => {
      state.emailTranscriptData = null;
      state.emailTranscriptError = null;
    },
  },
  extraReducers: (builder) => {
    // Dashboard Stats
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.dashboardStatsLoading = true;
        state.dashboardStatsError = null;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action) => {
        state.dashboardStatsLoading = false;
        state.dashboardStats = action.payload;
        state.dashboardStatsError = null;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.dashboardStatsLoading = false;
        state.dashboardStatsError = action.payload as string;
      });

    // Chat Volume Data
    builder
      .addCase(fetchChatVolumeData.pending, (state) => {
        state.chatVolumeLoading = true;
        state.chatVolumeError = null;
      })
      .addCase(fetchChatVolumeData.fulfilled, (state, action) => {
        state.chatVolumeLoading = false;
        state.chatVolumeData = action.payload;
        state.chatVolumeError = null;
      })
      .addCase(fetchChatVolumeData.rejected, (state, action) => {
        state.chatVolumeLoading = false;
        state.chatVolumeError = action.payload as string;
      });

    // AI Effectiveness Data
    builder
      .addCase(fetchAIEffectivenessData.pending, (state) => {
        state.aiEffectivenessLoading = true;
        state.aiEffectivenessError = null;
      })
      .addCase(fetchAIEffectivenessData.fulfilled, (state, action) => {
        state.aiEffectivenessLoading = false;
        state.aiEffectivenessData = action.payload;
        state.aiEffectivenessError = null;
      })
      .addCase(fetchAIEffectivenessData.rejected, (state, action) => {
        state.aiEffectivenessLoading = false;
        state.aiEffectivenessError = action.payload as string;
      });

    // Chat Status Data
    builder
      .addCase(fetchChatStatusData.pending, (state) => {
        state.chatStatusLoading = true;
        state.chatStatusError = null;
      })
      .addCase(fetchChatStatusData.fulfilled, (state, action) => {
        state.chatStatusLoading = false;
        state.chatStatusData = action.payload;
        state.chatStatusError = null;
      })
      .addCase(fetchChatStatusData.rejected, (state, action) => {
        state.chatStatusLoading = false;
        state.chatStatusError = action.payload as string;
      });

    // Top Intents Data
    builder
      .addCase(fetchTopIntentsData.pending, (state) => {
        state.topIntentsLoading = true;
        state.topIntentsError = null;
      })
      .addCase(fetchTopIntentsData.fulfilled, (state, action) => {
        state.topIntentsLoading = false;
        state.topIntentsData = action.payload;
        state.topIntentsError = null;
      })
      .addCase(fetchTopIntentsData.rejected, (state, action) => {
        state.topIntentsLoading = false;
        state.topIntentsError = action.payload as string;
      });

    // Satisfaction Data
    builder
      .addCase(fetchSatisfactionData.pending, (state) => {
        state.satisfactionLoading = true;
        state.satisfactionError = null;
      })
      .addCase(fetchSatisfactionData.fulfilled, (state, action) => {
        state.satisfactionLoading = false;
        state.satisfactionData = action.payload;
        state.satisfactionError = null;
      })
      .addCase(fetchSatisfactionData.rejected, (state, action) => {
        state.satisfactionLoading = false;
        state.satisfactionError = action.payload as string;
      });

    // Email Transcript Data
    builder
      .addCase(fetchEmailTranscriptData.pending, (state) => {
        state.emailTranscriptLoading = true;
        state.emailTranscriptError = null;
      })
      .addCase(fetchEmailTranscriptData.fulfilled, (state, action) => {
        state.emailTranscriptLoading = false;
        state.emailTranscriptData = action.payload;
        state.emailTranscriptError = null;
      })
      .addCase(fetchEmailTranscriptData.rejected, (state, action) => {
        state.emailTranscriptLoading = false;
        state.emailTranscriptError = action.payload as string;
      });
  },
});

export const {
  clearAnalyticsErrors,
  clearDashboardStats,
  clearChatVolumeData,
  clearAIEffectivenessData,
  clearChatStatusData,
  clearTopIntentsData,
  clearSatisfactionData,
  clearEmailTranscriptData,
} = analyticsSlice.actions;

export default analyticsSlice.reducer; 