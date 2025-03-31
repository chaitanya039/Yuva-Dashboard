import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

// Utility to trigger PDF download
const downloadBlob = (data, filename, type = 'application/pdf') => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

// EXPORT Invoice as PDF
export const exportInvoicePdf = createAsyncThunk(
  'invoice/exportInvoicePdf',
  async (orderId, thunkAPI) => {
    try {
      const response = await api.get(`/invoices/${orderId}`, {
        responseType: 'blob'
      });
      downloadBlob(response.data, `invoice_${orderId}.pdf`, 'application/pdf');
      return true;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to export invoice');
    }
  }
);

// Optional: GET Invoice Data (for preview or admin view)
export const fetchInvoiceData = createAsyncThunk(
  'invoice/fetchInvoiceData',
  async (orderId, thunkAPI) => {
    try {
      const response = await api.get(`/orders/${orderId}`);
      return response.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Failed to fetch invoice data');
    }
  }
);

const invoiceSlice = createSlice({
  name: 'invoice',
  initialState: {
    data: null,
    loading: false,
    error: null
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Fetch invoice data
      .addCase(fetchInvoiceData.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInvoiceData.fulfilled, (state, action) => {
        state.loading = false;
        state.data = action.payload;
      })
      .addCase(fetchInvoiceData.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Export invoice
      .addCase(exportInvoicePdf.rejected, (state, action) => {
        state.error = action.payload;
      });
  }
});

export default invoiceSlice.reducer;
