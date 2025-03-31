import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

// Utility to trigger CSV/Excel download
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

// EXPORT Orders as Excel
export const exportOrdersExcel = createAsyncThunk(
  'reports/exportOrdersExcel',
  async (_, thunkAPI) => {
    try {
      const response = await api.get('/reports/orders/export', {
        responseType: 'blob'
      });
      downloadBlob(response.data, 'orders_report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
        responseType: 'blob'
      });
      downloadBlob(response.data, 'expenses_report.xlsx', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
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
      const response = await api.get('/reports/top-selling-products?export=csv', {
        responseType: 'blob'
      });
      downloadBlob(response.data, 'top_selling_products.csv', 'text/csv');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to export top selling products');
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

const reportSlice = createSlice({
  name: 'reports',
  initialState: {
    topSelling: [],
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      .addCase(fetchTopSellingProducts.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchTopSellingProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.topSelling = action.payload;
      })
      .addCase(fetchTopSellingProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      .addCase(exportOrdersExcel.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(exportExpensesExcel.rejected, (state, action) => {
        state.error = action.payload;
      })
      .addCase(exportTopSellingProducts.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default reportSlice.reducer;
