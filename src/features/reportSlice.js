import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

// Utility to trigger CSV download
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

// ─── EXISTING EXPORTS ──────────────────────────────────────────────────────────
// EXPORT Orders as Excel
export const exportOrdersExcel = createAsyncThunk(
  'reports/exportOrdersExcel',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/reports/orders/export', {
        responseType: 'blob',
      });
      downloadBlob(
        response.data,
        'orders_report.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to export orders');
    }
  }
);

// EXPORT Expenses as Excel
export const exportExpensesExcel = createAsyncThunk(
  'reports/exportExpensesExcel',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/reports/expenses/export', {
        responseType: 'blob',
      });
      downloadBlob(
        response.data,
        'expenses_report.xlsx',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
      );
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to export expenses');
    }
  }
);

// EXPORT Top Selling Products as CSV
export const exportTopSellingProducts = createAsyncThunk(
  'reports/exportTopSellingProducts',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        '/reports/top-selling-products?export=csv',
        { responseType: 'blob' }
      );
      downloadBlob(response.data, 'top_selling_products.csv', 'text/csv');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        'Failed to export top selling products'
      );
    }
  }
);

// GET Top Selling Products (for dashboard)
export const fetchTopSellingProducts = createAsyncThunk(
  'reports/fetchTopSellingProducts',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/reports/top-selling-products');
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch top selling products');
    }
  }
);

// ─── NEW REPORT EXPORTS ────────────────────────────────────────────────────────

// 1. Monthly Revenue CSV
export const exportMonthlyRevenueCsv = createAsyncThunk(
  'reports/exportMonthlyRevenueCsv',
  async ({ startDate, endDate } = {}, thunkAPI) => {
    try {
      const qs = new URLSearchParams({ export: 'csv', startDate, endDate })
        .toString();
      const response = await api.get(
        `/reports/monthly-revenue?${qs}`,
        { responseType: 'blob' }
      );
      downloadBlob(response.data, 'monthly_revenue.csv', 'text/csv');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to export monthly revenue');
    }
  }
);

// 2. Discount Impact CSV
export const exportDiscountImpactCsv = createAsyncThunk(
  'reports/exportDiscountImpactCsv',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        `/reports/discount-impact?export=csv`,
        { responseType: 'blob' }
      );
      downloadBlob(response.data, 'discount_impact.csv', 'text/csv');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to export discount impact');
    }
  }
);

// 3. Revenue by Segment CSV
export const exportRevenueBySegmentCsv = createAsyncThunk(
  'reports/exportRevenueBySegmentCsv',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        `/reports/revenue-by-segment?export=csv`,
        { responseType: 'blob' }
      );
      downloadBlob(response.data, 'revenue_by_segment.csv', 'text/csv');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to export revenue by segment');
    }
  }
);

// 4. AR Aging CSV
export const exportARAgingCsv = createAsyncThunk(
  'reports/exportARAgingCsv',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        `/reports/ar-aging?export=csv`,
        { responseType: 'blob' }
      );
      downloadBlob(response.data, 'ar_aging.csv', 'text/csv');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to export AR aging report');
    }
  }
);

// 5. Outstanding Invoices CSV
export const exportOutstandingInvoicesCsv = createAsyncThunk(
  'reports/exportOutstandingInvoicesCsv',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(
        `/reports/outstanding-invoices?export=csv`,
        { responseType: 'blob' }
      );
      downloadBlob(response.data, 'outstanding_invoices.csv', 'text/csv');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        'Failed to export outstanding invoices'
      );
    }
  }
);

// 6. DSO CSV
export const exportDSOCsv = createAsyncThunk(
  'reports/exportDSOCsv',
  async (_, thunkAPI) => {
    try {
      const response = await api.get(`/reports/dso?export=csv`, {
        responseType: 'blob',
      });
      downloadBlob(response.data, 'dso_report.csv', 'text/csv');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to export DSO report');
    }
  }
);

// ─── NEW REPORT FETCHERS ──────────────────────────────────────────────────────

// 1. Fetch Monthly Revenue
export const fetchMonthlyRevenue = createAsyncThunk(
  'reports/fetchMonthlyRevenue',
  async ({ startDate, endDate } = {}, thunkAPI) => {
    try {
      const params = new URLSearchParams({ startDate, endDate }).toString();
      const res = await api.get(`/reports/monthly-revenue?${params}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch monthly revenue');
    }
  }
);

// 2. Fetch Discount Impact
export const fetchDiscountImpact = createAsyncThunk(
  'reports/fetchDiscountImpact',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/reports/discount-impact');
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch discount impact');
    }
  }
);

// 3. Fetch Revenue by Segment
export const fetchRevenueBySegment = createAsyncThunk(
  'reports/fetchRevenueBySegment',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/reports/revenue-by-segment');
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch revenue by segment');
    }
  }
);

// 4. Fetch AR Aging
export const fetchARAging = createAsyncThunk(
  'reports/fetchARAging',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/reports/ar-aging');
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch AR aging report');
    }
  }
);

// 5. Fetch Outstanding Invoices
export const fetchOutstandingInvoices = createAsyncThunk(
  'reports/fetchOutstandingInvoices',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/reports/outstanding-invoices');
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        'Failed to fetch outstanding invoices'
      );
    }
  }
);

// 6. Fetch DSO Report
export const fetchDSOReport = createAsyncThunk(
  'reports/fetchDSOReport',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/reports/dso');
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch DSO report');
    }
  }
);

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    topSelling: [],
    monthlyRevenue: [],
    discountImpact: {},
    revenueBySegment: [],
    arAging: [],
    outstandingInvoices: [],
    dsoReport: {},
    loading: false,
    error: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Top Selling
      .addCase(fetchTopSellingProducts.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchTopSellingProducts.fulfilled, (s, a) => {
        s.loading = false; s.topSelling = a.payload;
      })
      .addCase(fetchTopSellingProducts.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      })

      // Monthly Revenue
      .addCase(fetchMonthlyRevenue.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchMonthlyRevenue.fulfilled, (s, a) => {
        s.loading = false; s.monthlyRevenue = a.payload;
      })
      .addCase(fetchMonthlyRevenue.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      })

      // Discount Impact
      .addCase(fetchDiscountImpact.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchDiscountImpact.fulfilled, (s, a) => {
        s.loading = false; s.discountImpact = a.payload;
      })
      .addCase(fetchDiscountImpact.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      })

      // Revenue by Segment
      .addCase(fetchRevenueBySegment.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchRevenueBySegment.fulfilled, (s, a) => {
        s.loading = false; s.revenueBySegment = a.payload;
      })
      .addCase(fetchRevenueBySegment.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      })

      // AR Aging
      .addCase(fetchARAging.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchARAging.fulfilled, (s, a) => {
        s.loading = false; s.arAging = a.payload;
      })
      .addCase(fetchARAging.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      })

      // Outstanding Invoices
      .addCase(fetchOutstandingInvoices.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchOutstandingInvoices.fulfilled, (s, a) => {
        s.loading = false; s.outstandingInvoices = a.payload;
      })
      .addCase(fetchOutstandingInvoices.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      })

      // DSO Report
      .addCase(fetchDSOReport.pending, (s) => {
        s.loading = true; s.error = null;
      })
      .addCase(fetchDSOReport.fulfilled, (s, a) => {
        s.loading = false; s.dsoReport = a.payload;
      })
      .addCase(fetchDSOReport.rejected, (s, a) => {
        s.loading = false; s.error = a.payload;
      })

      // EXPORT rejections
      .addCase(exportOrdersExcel.rejected, (s, a) => { s.error = a.payload; })
      .addCase(exportExpensesExcel.rejected, (s, a) => { s.error = a.payload; })
      .addCase(exportTopSellingProducts.rejected, (s, a) => { s.error = a.payload; })
      .addCase(exportMonthlyRevenueCsv.rejected, (s, a) => { s.error = a.payload; })
      .addCase(exportDiscountImpactCsv.rejected, (s, a) => { s.error = a.payload; })
      .addCase(exportRevenueBySegmentCsv.rejected, (s, a) => { s.error = a.payload; })
      .addCase(exportARAgingCsv.rejected, (s, a) => { s.error = a.payload; })
      .addCase(exportOutstandingInvoicesCsv.rejected, (s, a) => { s.error = a.payload; })
      .addCase(exportDSOCsv.rejected, (s, a) => { s.error = a.payload; });
  },
});

export default reportSlice.reducer;
