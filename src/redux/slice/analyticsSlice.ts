import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../../services/api';

// Types
interface DashboardStats {
  totalChats: { value: number; trend: string };
  agentChats: { value: number; trend: string };
  aiChats: { value: number; trend: string };
  completedChats: { value: number; trend: string };
}

// interface ChatVolumeData {
//   date: string;
//   total: number;
//   ai: number;
//   agent: number;
// }

// interface EffectivenessData {
//   name: string;
//   value: number;
// }

interface AnalyticsState {
  // Dashboard Stats
  dashboardStats: DashboardStats | null;
  dashboardStatsLoading: boolean;
  dashboardStatsError: string | null;

  // // Chat Volume Data
  // chatVolumeData: ChatVolumeData[];
  // chatVolumeLoading: boolean;
  // chatVolumeError: string | null;

  // // AI Effectiveness Data
  // aiEffectivenessData: EffectivenessData[];
  // aiEffectivenessLoading: boolean;
  // aiEffectivenessError: string | null;
}

const initialState: AnalyticsState = {
  dashboardStats: null,
  dashboardStatsLoading: false,
  dashboardStatsError: null,
  // chatVolumeData: [],
  // chatVolumeLoading: false,
  // chatVolumeError: null,
  // aiEffectivenessData: [],
  // aiEffectivenessLoading: false,
  // aiEffectivenessError: null,
};

// Async thunks
export const fetchDashboardStats = createAsyncThunk(
  'analytics/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics?type=stats');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        return rejectWithValue('Failed to fetch dashboard stats');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching dashboard stats');
    }
  }
);

export const fetchChatVolumeData = createAsyncThunk(
  'analytics/fetchChatVolumeData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics?type=chat-volume');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        return rejectWithValue('Failed to fetch chat volume data');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching chat volume data');
    }
  }
);

export const fetchAIEffectivenessData = createAsyncThunk(
  'analytics/fetchAIEffectivenessData',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/analytics?type=ai-effectiveness');
      if (response.data.code === 200) {
        return response.data.data;
      } else {
        return rejectWithValue('Failed to fetch AI effectiveness data');
      }
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Error fetching AI effectiveness data');
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
      // state.chatVolumeError = null;
      // state.aiEffectivenessError = null;
    },
    clearDashboardStats: (state) => {
      state.dashboardStats = null;
      state.dashboardStatsError = null;
    },
    // clearChatVolumeData: (state) => {
    //   state.chatVolumeData = [];
    //   state.chatVolumeError = null;
    // },
    // clearAIEffectivenessData: (state) => {
    //   state.aiEffectivenessData = [];
    //   state.aiEffectivenessError = null;
    // },
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
      // .addCase(fetchChatVolumeData.pending, (state) => {
      //   state.chatVolumeLoading = true;
      //   state.chatVolumeError = null;
      // })
      // .addCase(fetchChatVolumeData.fulfilled, (state, action) => {
      //   state.chatVolumeLoading = false;
      //   state.chatVolumeData = action.payload;
      //   state.chatVolumeError = null;
      // })
      // .addCase(fetchChatVolumeData.rejected, (state, action) => {
      //   state.chatVolumeLoading = false;
      //   state.chatVolumeError = action.payload as string;
      // });

    // AI Effectiveness Data
    builder
      // .addCase(fetchAIEffectivenessData.pending, (state) => {
      //   state.aiEffectivenessLoading = true;
      //   state.aiEffectivenessError = null;
      // })
      // .addCase(fetchAIEffectivenessData.fulfilled, (state, action) => {
      //   state.aiEffectivenessLoading = false;
      //   state.aiEffectivenessData = action.payload;
      //   state.aiEffectivenessError = null;
      // })
      // .addCase(fetchAIEffectivenessData.rejected, (state, action) => {
      //   state.aiEffectivenessLoading = false;
      //   state.aiEffectivenessError = action.payload as string;
      // });
  },
});

export const {
  clearAnalyticsErrors,
  clearDashboardStats,
  // clearChatVolumeData,
  // clearAIEffectivenessData,
} = analyticsSlice.actions;

export default analyticsSlice.reducer; 