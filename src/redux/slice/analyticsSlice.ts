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

export const fetchAnalyticsAll = createAsyncThunk(
  "analytics/fetchAnalyticsAll",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/analytics");

      if (response.data.code === 200) {
        return response.data.data; 
      } else {
        return rejectWithValue("Failed to load analytics");
      }
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Error loading analytics");
    }
  }
);

const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnalyticsAll.pending, (state) => { 
        state.dashboardStatsLoading = true;
        state.chatVolumeLoading = true;
        state.aiEffectivenessLoading = true;
        state.chatStatusLoading = true;
        state.topIntentsLoading = true;
        state.satisfactionLoading = true;
        state.emailTranscriptLoading = true;

        state.dashboardStatsError = null;
        state.chatVolumeError = null;
        state.aiEffectivenessError = null;
        state.chatStatusError = null;
        state.topIntentsError = null;
        state.satisfactionError = null;
        state.emailTranscriptError = null;
      })

      .addCase(fetchAnalyticsAll.fulfilled, (state, action) => {
        const data = action.payload;

        state.dashboardStats = data.stats;  
        state.chatVolumeData = data.chatVolume;  
        state.aiEffectivenessData = data.aiEffectiveness;  
        state.chatStatusData = data.chatStatusBreakdown;  
        state.topIntentsData = data.topIntents;  
        state.satisfactionData = data.customerSatisfaction;  
        state.emailTranscriptData = data.emailTranscripts;  

        state.dashboardStatsLoading = false;
        state.chatVolumeLoading = false;
        state.aiEffectivenessLoading = false;
        state.chatStatusLoading = false;
        state.topIntentsLoading = false;
        state.satisfactionLoading = false;
        state.emailTranscriptLoading = false;
      })

      .addCase(fetchAnalyticsAll.rejected, (state, action) => {
        const error = action.payload as string;

        state.dashboardStatsError = error;
        state.chatVolumeError = error;
        state.aiEffectivenessError = error;
        state.chatStatusError = error;
        state.topIntentsError = error;
        state.satisfactionError = error;
        state.emailTranscriptError = error;


        state.dashboardStatsLoading = false;
        state.chatVolumeLoading = false;
        state.aiEffectivenessLoading = false;
        state.chatStatusLoading = false;
        state.topIntentsLoading = false;
        state.satisfactionLoading = false;
        state.emailTranscriptLoading = false;
      });
  },
});

export default analyticsSlice.reducer;

