import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';
import { toast } from 'react-toastify';

// 🔄 Update Stock
export const updateProductStock = createAsyncThunk(
  'inventory/updateProductStock',
  async ({ productId, action, quantity, remarks }, thunkAPI) => {
    try {
      const response = await api.patch(`/inventory/update-stock/${productId}`, {
        action,
        quantity,
        remarks
      });
      toast.success('Stock updated successfully');
      return response.data.data;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to update stock');
      return thunkAPI.rejectWithValue('Failed to update stock');
    }
  }
);

// 📜 Stock History
export const fetchStockHistory = createAsyncThunk(
  'inventory/fetchStockHistory',
  async (productId, thunkAPI) => {
    try {
      const res = await api.get(`/inventory/stock-history/${productId}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch stock history');
    }
  }
);

// 📦 Low Stock Products
export const fetchLowStockProducts = createAsyncThunk(
  'inventory/fetchLowStockProducts',
  async (_, thunkAPI) => {
    try {
      const res = await api.get(`/inventory/alerts`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch low stock products');
    }
  }
);

// 📊 Inventory Overview Summary
export const fetchInventoryOverview = createAsyncThunk(
  'inventory/fetchInventoryOverview',
  async (_, thunkAPI) => {
    try {
      const res = await api.get(`/inventory/overview`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch inventory overview');
    }
  }
);

// 🕓 Recent Stock Updates
export const fetchRecentStockUpdates = createAsyncThunk(
  'inventory/fetchRecentStockUpdates',
  async (_, thunkAPI) => {
    try {
      const res = await api.get(`/inventory/recent-stock-updates`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch recent stock updates');
    }
  }
);

// 📈 Stock Activity Chart
export const fetchStockActivityChartData = createAsyncThunk(
  'inventory/fetchStockActivityChartData',
  async (_, thunkAPI) => {
    try {
      const res = await api.get(`/inventory/stock-activity-chart`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch chart data');
    }
  }
);

// 🔁 Most Updated Products
export const fetchMostUpdatedProducts = createAsyncThunk(
  'inventory/fetchMostUpdatedProducts',
  async (_, thunkAPI) => {
    try {
      const res = await api.get(`/inventory/most-updated-products`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch updated product list');
    }
  }
);

// 📦 Order Snapshot
export const fetchOrderSnapshot = createAsyncThunk(
  'inventory/fetchOrderSnapshot',
  async (_, thunkAPI) => {
    try {
      const res = await api.get(`/inventory/order-snapshot`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch order snapshot');
    }
  }
);

const inventorySlice = createSlice({
  name: 'inventory',
  initialState: {
    updating: false,
    updateError: null,

    history: [],
    historyLoading: false,
    historyError: null,

    lowStock: [],
    lowStockLoading: false,
    lowStockError: null,

    overview: {},
    overviewLoading: false,
    overviewError: null,

    recentUpdates: [],
    recentUpdatesLoading: false,
    recentUpdatesError: null,

    chartData: [],
    chartLoading: false,
    chartError: null,

    mostUpdated: [],
    mostUpdatedLoading: false,
    mostUpdatedError: null,

    orderSnapshot: {},
    orderSnapshotLoading: false,
    orderSnapshotError: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // 🔄 Update Stock
      .addCase(updateProductStock.pending, state => {
        state.updating = true;
        state.updateError = null;
      })
      .addCase(updateProductStock.fulfilled, state => {
        state.updating = false;
      })
      .addCase(updateProductStock.rejected, (state, action) => {
        state.updating = false;
        state.updateError = action.payload;
      })

      // 📜 Stock History
      .addCase(fetchStockHistory.pending, state => {
        state.historyLoading = true;
        state.historyError = null;
      })
      .addCase(fetchStockHistory.fulfilled, (state, action) => {
        state.historyLoading = false;
        state.history = action.payload;
      })
      .addCase(fetchStockHistory.rejected, (state, action) => {
        state.historyLoading = false;
        state.historyError = action.payload;
      })

      // 📦 Low Stock Products
      .addCase(fetchLowStockProducts.pending, state => {
        state.lowStockLoading = true;
        state.lowStockError = null;
      })
      .addCase(fetchLowStockProducts.fulfilled, (state, action) => {
        state.lowStockLoading = false;
        state.lowStock = action.payload;
      })
      .addCase(fetchLowStockProducts.rejected, (state, action) => {
        state.lowStockLoading = false;
        state.lowStockError = action.payload;
      })

      // 📊 Inventory Overview
      .addCase(fetchInventoryOverview.pending, state => {
        state.overviewLoading = true;
        state.overviewError = null;
      })
      .addCase(fetchInventoryOverview.fulfilled, (state, action) => {
        state.overviewLoading = false;
        state.overview = action.payload;
      })
      .addCase(fetchInventoryOverview.rejected, (state, action) => {
        state.overviewLoading = false;
        state.overviewError = action.payload;
      })

      // 🕓 Recent Stock Updates
      .addCase(fetchRecentStockUpdates.pending, state => {
        state.recentUpdatesLoading = true;
        state.recentUpdatesError = null;
      })
      .addCase(fetchRecentStockUpdates.fulfilled, (state, action) => {
        state.recentUpdatesLoading = false;
        state.recentUpdates = action.payload;
      })
      .addCase(fetchRecentStockUpdates.rejected, (state, action) => {
        state.recentUpdatesLoading = false;
        state.recentUpdatesError = action.payload;
      })

      // 📈 Stock Activity Chart
      .addCase(fetchStockActivityChartData.pending, state => {
        state.chartLoading = true;
        state.chartError = null;
      })
      .addCase(fetchStockActivityChartData.fulfilled, (state, action) => {
        state.chartLoading = false;
        state.chartData = action.payload;
      })
      .addCase(fetchStockActivityChartData.rejected, (state, action) => {
        state.chartLoading = false;
        state.chartError = action.payload;
      })

      // 🔁 Most Updated Products
      .addCase(fetchMostUpdatedProducts.pending, state => {
        state.mostUpdatedLoading = true;
        state.mostUpdatedError = null;
      })
      .addCase(fetchMostUpdatedProducts.fulfilled, (state, action) => {
        state.mostUpdatedLoading = false;
        state.mostUpdated = action.payload;
      })
      .addCase(fetchMostUpdatedProducts.rejected, (state, action) => {
        state.mostUpdatedLoading = false;
        state.mostUpdatedError = action.payload;
      })

      // 📦 Order Snapshot
      .addCase(fetchOrderSnapshot.pending, state => {
        state.orderSnapshotLoading = true;
        state.orderSnapshotError = null;
      })
      .addCase(fetchOrderSnapshot.fulfilled, (state, action) => {
        state.orderSnapshotLoading = false;
        state.orderSnapshot = action.payload;
      })
      .addCase(fetchOrderSnapshot.rejected, (state, action) => {
        state.orderSnapshotLoading = false;
        state.orderSnapshotError = action.payload;
      });
  }
});

export default inventorySlice.reducer;
