import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import api from "../../services/api";
import { AxiosError } from "axios";
import Cookies from "js-cookie";

interface Organization {
  id?: string;
  aiOrgId?: string;
  name?: string;
  phone?: string;
  address?: string;
  city?: string;
  state?: string;
  country?: string;
  zip?: number | null;
  domain?: string;
  industry?: string;
  description?: string;
  emailConfig: {
    host: string;
    port: string;
    secure: string;
    user: string;
    pass: string;
  };
}

interface OrganizationState {
  data: Organization | null;
  loading: boolean;
  error: string | null;
}

const token = Cookies.get("access_token");

export const fetchOrganization = createAsyncThunk<
  { data: Organization },
  string,
  { rejectValue: string }
>("organization/fetchOrganization", async (orgId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/org/?orgId=${orgId}`, {
      headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Something went wrong";
    if (error instanceof AxiosError) {
      errorMessage = (error.response?.data as string) || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

export const updateOrganization = createAsyncThunk<
  { data: Organization },
  { orgId: string; data: Organization },
  { rejectValue: string }
>("organization/updateOrganization", async ({ orgId, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/org/?orgId=${orgId}`, data, {
      headers: { Authorization: `Bearer ${token}`}
    });
    return response.data;
  } catch (error: unknown) {
    let errorMessage = "Something went wrong";
    if (error instanceof AxiosError) {
      errorMessage = (error.response?.data as string) || errorMessage;
    }
    return rejectWithValue(errorMessage);
  }
});

const initialState: OrganizationState = {
  data: null,
  loading: false,
  error: null,
};

const organizationSlice = createSlice({
  name: "organization",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchOrganization.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrganization.fulfilled, (state, action: PayloadAction<{ data: Organization }>) => {
        state.loading = false;
        state.data = action.payload.data;
      })
      .addCase(fetchOrganization.rejected, (state, action: PayloadAction<string | undefined>) => {
        state.loading = false;
        state.error = action.payload || "Something went wrong";
      });
  },
});

export default organizationSlice.reducer;
