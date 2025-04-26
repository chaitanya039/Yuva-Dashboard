import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

// Blob download utility
const downloadBlob = (data, filename, type = 'text/csv') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// Export Thunks
export const exportOrdersExcel = createAsyncThunk('reports/exportOrdersExcel', async (_, thunkAPI) => {
  try {
    const res = await api.get('/reports/orders/export', { responseType: 'blob' });
    downloadBlob(res.data, 'orders_report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    return true;
  } catch {
    return thunkAPI.rejectWithValue('Failed to export orders');
  }
});

// Add other export thunks here similarly...

// Fetch Thunks
export const fetchTopSellingProducts = createAsyncThunk('reports/fetchTopSellingProducts', async (_, thunkAPI) => {
  try {
    const res = await api.get('/reports/top-selling-products');
    return res.data.data;
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch top selling products');
  }
});

export const fetchMonthlyRevenue = createAsyncThunk('reports/fetchMonthlyRevenue', async ({ startDate, endDate } = {}, thunkAPI) => {
  try {
    const query = new URLSearchParams({ startDate, endDate }).toString();
    const res = await api.get(`/reports/monthly-revenue?${query}`);
    return res.data.data;
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch monthly revenue');
  }
});

export const fetchDiscountImpact = createAsyncThunk('reports/fetchDiscountImpact', async (_, thunkAPI) => {
  try {
    const res = await api.get('/reports/discount-impact');
    return res.data.data;
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch discount impact');
  }
});

export const fetchRevenueBySegment = createAsyncThunk('reports/fetchRevenueBySegment', async (_, thunkAPI) => {
  try {
    const res = await api.get('/reports/revenue-by-segment');
    return res.data.data;
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch revenue by segment');
  }
});

export const fetchARAging = createAsyncThunk('reports/fetchARAging', async (_, thunkAPI) => {
  try {
    const res = await api.get('/reports/ar-aging');
    return res.data.data;
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch AR aging');
  }
});

export const fetchOutstandingInvoices = createAsyncThunk('reports/fetchOutstandingInvoices', async (_, thunkAPI) => {
  try {
    const res = await api.get('/reports/outstanding-invoices');
    return res.data.data;
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch outstanding invoices');
  }
});

export const fetchDSOReport = createAsyncThunk('reports/fetchDSOReport', async (_, thunkAPI) => {
  try {
    const res = await api.get('/reports/dso');
    return res.data.data;
  } catch {
    return thunkAPI.rejectWithValue('Failed to fetch DSO report');
  }
});

// Slice
const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    topSelling: [],
    topSellingLoading: false,
    topSellingError: null,

    monthlyRevenue: [],
    monthlyRevenueLoading: false,
    monthlyRevenueError: null,

    discountImpact: {},
    discountImpactLoading: false,
    discountImpactError: null,

    revenueBySegment: [],
    revenueBySegmentLoading: false,
    revenueBySegmentError: null,

    arAging: [],
    arAgingLoading: false,
    arAgingError: null,

    outstandingInvoices: [],
    outstandingInvoicesLoading: false,
    outstandingInvoicesError: null,

    dsoReport: {},
    dsoReportLoading: false,
    dsoReportError: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTopSellingProducts.pending, (state) => {
        state.topSellingLoading = true;
        state.topSellingError = null;
      })
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.topSelling = action.payload;
        state.topSellingLoading = false;
      })
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.topSellingLoading = false;
        state.topSellingError = action.payload;
      })

      .addCase(fetchMonthlyRevenue.pending, (state) => {
        state.monthlyRevenueLoading = true;
        state.monthlyRevenueError = null;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (state, action) => {
        state.monthlyRevenue = action.payload;
        state.monthlyRevenueLoading = false;
      })
      .addCase(fetchMonthlyRevenue.rejected, (state, action) => {
        state.monthlyRevenueLoading = false;
        state.monthlyRevenueError = action.payload;
      })

      .addCase(fetchDiscountImpact.pending, (state) => {
        state.discountImpactLoading = true;
        state.discountImpactError = null;
      })
      .addCase(fetchDiscountImpact.fulfilled, (state, action) => {
        state.discountImpact = action.payload;
        state.discountImpactLoading = false;
      })
      .addCase(fetchDiscountImpact.rejected, (state, action) => {
        state.discountImpactLoading = false;
        state.discountImpactError = action.payload;
      })

      .addCase(fetchRevenueBySegment.pending, (state) => {
        state.revenueBySegmentLoading = true;
        state.revenueBySegmentError = null;
      })
      .addCase(fetchRevenueBySegment.fulfilled, (state, action) => {
        state.revenueBySegment = action.payload;
        state.revenueBySegmentLoading = false;
      })
      .addCase(fetchRevenueBySegment.rejected, (state, action) => {
        state.revenueBySegmentLoading = false;
        state.revenueBySegmentError = action.payload;
      })

      .addCase(fetchARAging.pending, (state) => {
        state.arAgingLoading = true;
        state.arAgingError = null;
      })
      .addCase(fetchARAging.fulfilled, (state, action) => {
        state.arAging = action.payload;
        state.arAgingLoading = false;
      })
      .addCase(fetchARAging.rejected, (state, action) => {
        state.arAgingLoading = false;
        state.arAgingError = action.payload;
      })

      .addCase(fetchOutstandingInvoices.pending, (state) => {
        state.outstandingInvoicesLoading = true;
        state.outstandingInvoicesError = null;
      })
      .addCase(fetchOutstandingInvoices.fulfilled, (state, action) => {
        state.outstandingInvoices = action.payload;
        state.outstandingInvoicesLoading = false;
      })
      .addCase(fetchOutstandingInvoices.rejected, (state, action) => {
        state.outstandingInvoicesLoading = false;
        state.outstandingInvoicesError = action.payload;
      })

      .addCase(fetchDSOReport.pending, (state) => {
        state.dsoReportLoading = true;
        state.dsoReportError = null;
      })
      .addCase(fetchDSOReport.fulfilled, (state, action) => {
        state.dsoReport = action.payload;
        state.dsoReportLoading = false;
      })
      .addCase(fetchDSOReport.rejected, (state, action) => {
        state.dsoReportLoading = false;
        state.dsoReportError = action.payload;
      });
  },
});

export default reportSlice.reducer;
