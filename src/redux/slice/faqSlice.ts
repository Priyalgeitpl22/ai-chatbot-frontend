// src/redux/slice/faqSlice.ts
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  enabled: boolean
  createdAt?: string;
  updatedAt?: string;
}

interface FAQState {
  faqs: FAQ[];
  loading: boolean;
  error: string | null;
}

const token = Cookies.get("access_token");

// GET: Fetch FAQs by orgId
export const fetchFAQs = createAsyncThunk<
  FAQ[],
  string,
  { rejectValue: string }
>("faq/fetchFAQs", async (orgId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/faq/${orgId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data.faqs;
  } catch (error: any) {
    let errorMessage = "Failed to fetch FAQs";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// POST: Create FAQs
export const createFAQs = createAsyncThunk<
  FAQ[],
  { orgId: string; faqs: { question: string; answer: string }[] },
  { rejectValue: string }
>("faq/createFAQs", async ({ orgId, faqs }, { rejectWithValue }) => {
  try {
    const response = await api.post(
      `/faq/create`,
      { orgId, faqs },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.faqs;
  } catch (error: any) {
    let errorMessage = "Failed to create FAQs";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

// PUT: Update FAQ enabled status
export const updateFAQStatus = createAsyncThunk<
  FAQ,
  { faqId: string; enabled: boolean },
  { rejectValue: string }
>("faq/updateFAQStatus", async ({ faqId, enabled }, { rejectWithValue }) => {
  const token = Cookies.get("access_token");
  try {
    const response = await api.put(
      `/faq/${faqId}`,
      { enabled },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data.faq; 
  } catch (error: any) {
    let errorMessage = "Failed to update FAQ status";
    if (error instanceof AxiosError) {
      errorMessage = error.response?.data?.message || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

const initialState: FAQState = {
  faqs: [],
  loading: false,
  error: null,
};

const faqSlice = createSlice({
  name: "faq",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchFAQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchFAQs.fulfilled, (state, action: PayloadAction<FAQ[]>) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(fetchFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to fetch FAQs";
      })
      .addCase(createFAQs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createFAQs.fulfilled, (state, action: PayloadAction<FAQ[]>) => {
        state.loading = false;
        state.faqs = action.payload;
      })
      .addCase(createFAQs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || "Failed to create FAQs";
      })
      .addCase(updateFAQStatus.fulfilled, (state, action: PayloadAction<FAQ>) => {
        const idx = state.faqs.findIndex(faq => faq.id === action.payload.id);
        if (idx !== -1) {
          state.faqs[idx] = action.payload;
        }
      })
      .addCase(updateFAQStatus.rejected, (state, action) => {
        state.error = action.payload || "Failed to update FAQ status";
      });
  },
});

export default faqSlice.reducer;