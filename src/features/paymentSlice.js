import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// Helper to create GET thunks
const createGetThunk = (name, endpoint) =>
  createAsyncThunk(name, async (params = {}, thunkAPI) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(query ? `${endpoint}?${query}` : endpoint);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || `Failed to fetch ${name}`
      );
    }
  });

// ============================
// 💳 PAYMENT ANALYSIS THUNKS
// ============================

export const fetchTotalRevenueCollected = createGetThunk("payments/fetchTotalRevenueCollected", "/payments/total-revenue");
export const fetchOutstandingBalance = createGetThunk("payments/fetchOutstandingBalance", "/payments/outstanding-balance");
export const fetchAvgRecoveryPercentage = createGetThunk("payments/fetchAvgRecoveryPercentage", "/payments/average-recovery");
export const fetchPaymentStatusDistribution = createGetThunk("payments/fetchPaymentStatusDistribution", "/payments/payment-status-distribution");
export const fetchDiscountStats = createGetThunk("payments/fetchDiscountStats", "/payments/discount-stats");
export const fetchPartialPayments = createGetThunk("payments/fetchPartialPayments", "/payments/partial-payments");
export const fetchTopCustomerPaymentBehavior = createGetThunk("payments/fetchTopCustomerPaymentBehavior", "/payments/top-customers");
export const fetchMonthlyCollectionTrend = createGetThunk("payments/fetchMonthlyCollectionTrend", "/payments/monthly-collection-trend");

// ============================
// 💳 PAYMENT SLICE
// ============================

const paymentSlice = createSlice({
  name: "payment",
  initialState: {
    loading: false,
    error: null,
    totalRevenueCollected: 0,
    outstandingBalance: 0,
    avgRecoveryPercentage: 0,
    paymentStatusDistribution: [],
    discountStats: {
      totalDiscount: 0,
      averageDiscount: 0,
      discountToRevenueRatio: 0,
    },
    partiallyPaidOrders: [],
    highDueCustomers: [],
    topCustomerBehavior: [],
    monthlyCollectionTrend: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    const addCases = (thunk, key, transformFn = (d) => d) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          const data = transformFn(action.payload);
          if (typeof key === "object") {
            for (const [k, v] of Object.entries(key)) {
              state[v] = data[k];
            }
          } else {
            state[key] = data;
          }
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    };

    addCases(fetchTotalRevenueCollected, "totalRevenueCollected", (d) => d.totalCollected);
    addCases(fetchOutstandingBalance, "outstandingBalance", (d) => d.totalOutstanding);
    addCases(fetchAvgRecoveryPercentage, "avgRecoveryPercentage", (d) => parseFloat(d.avgRecovery));
    addCases(fetchPaymentStatusDistribution, "paymentStatusDistribution");
    addCases(fetchDiscountStats, "discountStats");
    addCases(fetchPartialPayments, {
      partiallyPaidOrders: "partiallyPaidOrders",
      highDueCustomers: "highDueCustomers"
    }, (d) => ({
      partiallyPaidOrders: d.partiallyPaidOrders,
      highDueCustomers: d.highDueCustomers
    }));
    addCases(fetchTopCustomerPaymentBehavior, "topCustomerBehavior");
    addCases(fetchMonthlyCollectionTrend, "monthlyCollectionTrend");
  },
});

export default paymentSlice.reducer;
