import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import type { PayloadAction } from "@reduxjs/toolkit";
import type { Server, CreateServerRequest } from "../types";
import { 
  getUserServersApi, 
  createServerApi, 
  joinByInviteApi, 
  getServerApi 
} from "../api/serverApi";

// Define error response type
interface ErrorResponse {
  response?: {
    data?: {
      message?: string;
    };
  };
  message?: string;
}

interface ServerState {
  userServers: Server[];
  currentServer: Server | null;
  loading: boolean;
  error: string | null;
}

const initialState: ServerState = {
  userServers: [],
  currentServer: null,
  loading: false,
  error: null,
};

export const fetchUserServers = createAsyncThunk(
  "servers/fetchUserServers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await getUserServersApi();
      return response.data.data;
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to fetch servers");
    }
  }
);

export const createServer = createAsyncThunk(
  "servers/createServer",
  async (data: CreateServerRequest, { rejectWithValue }) => {
    try {
      const response = await createServerApi(data);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to create server");
    }
  }
);

export const joinServerByInvite = createAsyncThunk(
  "servers/joinByInvite",
  async (code: string, { rejectWithValue }) => {
    try {
      const response = await joinByInviteApi(code);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to join server");
    }
  }
);

export const fetchServerDetails = createAsyncThunk(
  "servers/fetchServerDetails",
  async (serverId: string, { rejectWithValue }) => {
    try {
      const response = await getServerApi(serverId);
      return response.data.data;
    } catch (error: unknown) {
      const err = error as ErrorResponse;
      return rejectWithValue(err.response?.data?.message || err.message || "Failed to fetch server details");
    }
  }
);

const serverSlice = createSlice({
  name: "servers",
  initialState,
  reducers: {
    setCurrentServer: (state, action: PayloadAction<Server | null>) => {
      state.currentServer = action.payload;
    },
    clearServerError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Servers
      .addCase(fetchUserServers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserServers.fulfilled, (state, action: PayloadAction<Server[]>) => {
        state.loading = false;
        state.userServers = action.payload;
      })
      .addCase(fetchUserServers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Create Server
      .addCase(createServer.fulfilled, (state, action: PayloadAction<Server>) => {
        state.userServers.push(action.payload);
      })
      // Join Server
      .addCase(joinServerByInvite.fulfilled, (state, action: PayloadAction<Server>) => {
        state.userServers.push(action.payload);
      })
      // Fetch Server Details
      .addCase(fetchServerDetails.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.currentServer = null;
      })
      .addCase(fetchServerDetails.fulfilled, (state, action: PayloadAction<Server>) => {
        state.loading = false;
        state.currentServer = action.payload;
      })
      .addCase(fetchServerDetails.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setCurrentServer, clearServerError } = serverSlice.actions;
export default serverSlice.reducer;
