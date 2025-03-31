import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

// Create order request (user panel)
export const createOrderRequest = createAsyncThunk(
  'orderRequests/createOrderRequest',
  async (data, thunkAPI) => {
    try {
      const res = await api.post('/order-requests', data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to request order');
    }
  }
);

// Fetch order requests (admin panel with pagination + search)
export const fetchOrderRequests = createAsyncThunk(
  'orderRequests/fetchOrderRequests',
  async (params, thunkAPI) => {
    try {
      const res = await api.get('/order-requests', { params });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to fetch order requests');
    }
  }
);

// Approve order request
export const approveOrderRequest = createAsyncThunk(
  'orderRequests/approveOrderRequest',
  async (id, thunkAPI) => {
    try {
      const res = await api.put(`/order-requests/approve/${id}`);
      return { ...res.data.data, id };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to approve order');
    }
  }
);

// Reject order request
export const rejectOrderRequest = createAsyncThunk(
  'orderRequests/rejectOrderRequest',
  async (id, thunkAPI) => {
    try {
      const res = await api.put(`/order-requests/reject/${id}`);
      return { ...res.data.data, id };
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Failed to reject order');
    }
  }
);

const orderRequestSlice = createSlice({
  name: 'orderRequests',
  initialState: {
    requests: [],
    totalRequests: 0,
    loading: false,
    approving: false,
    rejecting: false,
    filters: {
      page: 1,
      limit: 10,
      search: '',
      sort: 'newest'
    },
    error: null
  },
  reducers: {
    setRequestFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetRequestFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        search: '',
        sort: 'newest'
      };
    }
  },
  extraReducers: builder => {
    builder
      .addCase(fetchOrderRequests.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.requests = action.payload.requests;
        state.totalRequests = action.payload.total;
      })
      .addCase(fetchOrderRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(createOrderRequest.fulfilled, (state, action) => {
        state.requests.unshift(action.payload);
      })

      .addCase(approveOrderRequest.pending, (state) => {
        state.approving = true;
      })
      .addCase(approveOrderRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r._id === action.payload.id);
        if (index !== -1) state.requests[index].status = 'Approved';
        state.approving = false;
      })
      .addCase(approveOrderRequest.rejected, (state, action) => {
        state.approving = false;
        state.error = action.payload;
      })

      .addCase(rejectOrderRequest.pending, (state) => {
        state.rejecting = true;
      })
      .addCase(rejectOrderRequest.fulfilled, (state, action) => {
        const index = state.requests.findIndex(r => r._id === action.payload.id);
        if (index !== -1) state.requests[index].status = 'Rejected';
        state.rejecting = false;
      })
      .addCase(rejectOrderRequest.rejected, (state, action) => {
        state.rejecting = false;
        state.error = action.payload;
      });
  }
});

export const { setRequestFilters, resetRequestFilters } = orderRequestSlice.actions;
export default orderRequestSlice.reducer;
