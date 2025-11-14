// src/redux/slice/dynamicDataSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export interface DynamicData {
  id?: string;
  prompt: string;
  apiCurl: string;
  orgId?: string;
  createdAt?: string;
  updatedAt?: string;
}

interface DynamicDataState {
  dynamicData: DynamicData | null;
  dynamicDataList: DynamicData[];
  loading: boolean;
  error: string | null;
}

const token = Cookies.get("access_token");

// GET: Fetch Dynamic Data by orgId
export const fetchDynamicData = createAsyncThunk<
  DynamicData | DynamicData[],
  string,
  { rejectValue: string }
>("dynamicData/fetchDynamicData", async (orgId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/dynamic-data/${orgId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = response.data.data || response.data;
    return data;
  } catch (error: any) {
    let errorMessage = "Failed to fetch dynamic data";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// GET: Fetch All Dynamic Data by orgId
export const fetchAllDynamicData = createAsyncThunk<
  DynamicData[],
  string,
  { rejectValue: string }
>("dynamicData/fetchAllDynamicData", async (orgId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/dynamic-data/all/${orgId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    // Handle both array and object responses
    const data = response.data.dynamicData || response.data;
    return Array.isArray(data) ? data : (data ? [data] : []);
  } catch (error: any) {
    let errorMessage = "Failed to fetch dynamic data list";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// POST: Create Dynamic Data
export const createDynamicData = createAsyncThunk<
  DynamicData,
  { orgId: string; data: { prompt: string; apiCurl: string } },
  { rejectValue: string }
>("dynamicData/createDynamicData", async ({ orgId, data }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/dynamic-data/create`,
      { orgId, prompt: data.prompt, apiCurl: data.apiCurl },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.dynamicData || response.data;
  } catch (error: any) {
    let errorMessage = "Failed to create dynamic data";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// POST: Create Multiple Dynamic Data (Batch)
export const createMultipleDynamicData = createAsyncThunk<
  DynamicData[],
  { orgId: string; data: Array<{ prompt: string; apiCurl: string }> },
  { rejectValue: string }
>("dynamicData/createMultipleDynamicData", async ({ orgId, data }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/dynamic-data/create`,
      data.map(item => ({ 
        prompt: item.prompt, 
        apiCurl: item.apiCurl,
        orgId: orgId
      })),
      { headers: { Authorization: `Bearer ${token}` } }
    );
    // Handle both array and object responses
    const result = response.data.dynamicData || response.data;
    return Array.isArray(result) ? result : (result ? [result] : []);
  } catch (error: any) {
    let errorMessage = "Failed to create dynamic data";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// DELETE: Delete Dynamic Data
export const deleteDynamicData = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("dynamicData/deleteDynamicData", async (dynamicDataId, { rejectWithValue }) => {
  const token = Cookies.get("access_token");
  try {
    await api.delete(`/dynamic-data/${dynamicDataId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return dynamicDataId;
  } catch (error: any) {
    let errorMessage = "Failed to delete dynamic data";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// POST: Execute Dynamic Data (Go button action)
export const executeDynamicData = createAsyncThunk<
  any,
  { orgId: string; prompt: string; apiCurl: string },
  { rejectValue: string }
>("dynamicData/executeDynamicData", async ({ orgId, prompt, apiCurl }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/dynamic-data/execute`,
      { orgId, prompt, apiCurl: apiCurl },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error: any) {
    let errorMessage = "Failed to execute dynamic data";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

const initialState: DynamicDataState = {
  dynamicData: null,
  dynamicDataList: [],
  loading: false,
  error: null,
};

const dynamicDataSlice = createSlice({
  name: "dynamicData",
  initialState,
  reducers: {
    clearDynamicData: (state) => {
      state.dynamicData = null;
      state.error = null;
    },
    setDynamicData: (state, action: PayloadAction<DynamicData>) => {
      state.dynamicData = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Dynamic Data
      .addCase(fetchDynamicData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchDynamicData.fulfilled, (state, action: PayloadAction<DynamicData | DynamicData[]>) => {
        state.loading = false;
        // Handle both array and single object responses
        if (Array.isArray(action.payload)) {
          state.dynamicDataList = action.payload;
          state.dynamicData = action.payload.length > 0 ? action.payload[0] : null;
        } else {
          const singleData = action.payload;
          state.dynamicData = singleData;
          // If it's a single object, add it to the list if not already present
          if (singleData.id && !state.dynamicDataList.find(d => d.id === singleData.id)) {
            state.dynamicDataList = [singleData];
          } else if (!singleData.id) {
            state.dynamicDataList = [singleData];
          }
        }
      })
      .addCase(fetchDynamicData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dynamic data";
      })
      // Fetch All Dynamic Data
      .addCase(fetchAllDynamicData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllDynamicData.fulfilled, (state, action: PayloadAction<DynamicData[]>) => {
        state.loading = false;
        state.dynamicDataList = action.payload;
      })
      .addCase(fetchAllDynamicData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch dynamic data list";
      })
      // Create Dynamic Data
      .addCase(createDynamicData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createDynamicData.fulfilled, (state, action: PayloadAction<DynamicData>) => {
        state.loading = false;
        state.dynamicData = action.payload;
        // Add to list if not already present
        if (action.payload.id && !state.dynamicDataList.find(d => d.id === action.payload.id)) {
          state.dynamicDataList.push(action.payload);
        }
      })
      .addCase(createDynamicData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create dynamic data";
      })
      // Create Multiple Dynamic Data (Batch)
      .addCase(createMultipleDynamicData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createMultipleDynamicData.fulfilled, (state, action: PayloadAction<DynamicData[]>) => {
        state.loading = false;
        // Add all new entries to the list
        action.payload.forEach(newItem => {
          if (newItem.id && !state.dynamicDataList.find(d => d.id === newItem.id)) {
            state.dynamicDataList.push(newItem);
          }
        });
        // Set the first item as the current dynamicData if list was empty
        if (action.payload.length > 0 && !state.dynamicData) {
          state.dynamicData = action.payload[0];
        }
      })
      .addCase(createMultipleDynamicData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create dynamic data";
      })
      // Delete Dynamic Data
      .addCase(deleteDynamicData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteDynamicData.fulfilled, (state, action: PayloadAction<string>) => {
        state.loading = false;
        state.dynamicDataList = state.dynamicDataList.filter(d => d.id !== action.payload);
        if (state.dynamicData?.id === action.payload) {
          state.dynamicData = null;
        }
      })
      .addCase(deleteDynamicData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to delete dynamic data";
      })
      // Execute Dynamic Data
      .addCase(executeDynamicData.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(executeDynamicData.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(executeDynamicData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to execute dynamic data";
      });
  },
});

export const { clearDynamicData, setDynamicData } = dynamicDataSlice.actions;
export default dynamicDataSlice.reducer;

