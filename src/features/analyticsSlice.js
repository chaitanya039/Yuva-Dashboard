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
      return thunkAPI.rejectWithValue(err.response?.data?.message || `Failed to fetch ${name}`);
    }
  });

// ============================
// 📊 ANALYTICS THUNKS
// ============================

export const fetchKPIStats = createGetThunk("analytics/fetchKPIStats", "/analytics/kpi");
export const fetchRevenueBreakdown = createGetThunk("analytics/fetchRevenueBreakdown", "/analytics/revenue-breakdown");
export const fetchExpenseBreakdown = createGetThunk("analytics/fetchExpenseBreakdown", "/analytics/expenses/breakdown");
export const fetchSalesByCategory = createGetThunk("analytics/fetchSalesByCategory", "/analytics/sales-by-category");
export const fetchRevenueVsExpense = createGetThunk("analytics/fetchRevenueVsExpense", "/analytics/revenue-vs-expense");
export const fetchNetProfitTrend = createGetThunk("analytics/fetchNetProfitTrend", "/analytics/net-profit-trend");
export const fetchTopCustomers = createGetThunk("analytics/fetchTopCustomers", "/analytics/top-customers");
export const fetchMonthlyOrderCount = createGetThunk("analytics/fetchMonthlyOrderCount", "/analytics/monthly-orders");
export const fetchOrderTypeDistribution = createGetThunk("analytics/fetchOrderTypeDistribution", "/analytics/order-type-distribution");
export const fetchTopCustomersByRevenue = createGetThunk("analytics/fetchTopCustomersByRevenue", "/analytics/top-customers-by-revenue");
export const fetchMostSoldProducts = createGetThunk("analytics/fetchMostSoldProducts", "/analytics/most-sold-products");
export const fetchMonthlyOrderRevenueTrend = createGetThunk("analytics/fetchMonthlyOrderRevenueTrend", "/analytics/monthly-order-revenue-trend");
export const fetchCustomerTypeDistribution = createGetThunk("analytics/fetchCustomerTypeDistribution", "/analytics/customer-type-distribution");
export const fetchAverageOrderValueTrend = createGetThunk("analytics/fetchAverageOrderValueTrend", "/analytics/aov-trend");
export const fetchCategoryWiseRevenue = createGetThunk("analytics/fetchCategoryWiseRevenue", "/analytics/category-wise-revenue");
export const fetchCustomerRegistrationTrend = createGetThunk("analytics/fetchCustomerRegistrationTrend", "/analytics/registration-trend");
export const fetchRecentActivity = createGetThunk("analytics/fetchRecentActivity", "/analytics/recent-activity");
export const fetchRepeatVsNewCustomers = createGetThunk("analytics/fetchRepeatVsNewCustomers", "/analytics/repeat-vs-new");
export const fetchWeekdayOrderHeatmap = createGetThunk("analytics/fetchWeekdayOrderHeatmap", "/analytics/weekday-heatmap");
export const fetchCancelledOrdersStats = createGetThunk("analytics/fetchCancelledOrdersStats", "/analytics/cancelled-orders");
export const fetchLowStockProducts = createGetThunk("analytics/fetchLowStockProducts", "/analytics/low-stock-products");
export const fetchCustomerSegments = createGetThunk("analytics/fetchCustomerSegments", "/analytics/customer-segments");
export const fetchRevenueByCity = createGetThunk("analytics/fetchRevenueByCity", "/analytics/revenue-by-city");
// 1️⃣ Thunk in analyticsSlice.js
export const fetchCustomerDistribution = createGetThunk(
  "analytics/fetchCustomerDistribution",
  "/analytics/customer-distribution"
);

// ============================
// 📊 ANALYTICS SLICE
// ============================

const analyticsSlice = createSlice({
  name: "analytics",
  initialState: {
    loading: false,
    error: null,
    // KPI groups
    kpi: null,
    revenueBreakdown: [],
    expenseBreakdown: [],
    salesByCategory: [],
    revenueVsExpense: [],
    netProfitTrend: [],
    customerDistribution: [],
    topCustomers: [],
    monthlyOrderCount: [],
    orderTypeDistribution: [],
    topCustomersByRevenue: [],
    mostSoldProducts: [],
    monthlyOrderRevenueTrend: [],
    customerTypeDistribution: [],
    averageOrderValueTrend: [],
    categoryWiseRevenue: [],
    customerRegistrationTrend: [],
    recentActivity: null,
    repeatVsNewCustomers: [],
    weekdayOrderHeatmap: [],
    cancelledOrdersStats: null,
    lowStockProducts: [],
    customerSegments: [],
    revenueByCity: [],
  },
  reducers: {},
  extraReducers: (builder) => {
    const addCases = (thunk, key) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state[key] = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    };

    // Register all thunks
    addCases(fetchKPIStats, "kpi");
    addCases(fetchRevenueBreakdown, "revenueBreakdown");
    addCases(fetchExpenseBreakdown, "expenseBreakdown");
    addCases(fetchSalesByCategory, "salesByCategory");
    addCases(fetchRevenueVsExpense, "revenueVsExpense");
    addCases(fetchNetProfitTrend, "netProfitTrend");
    addCases(fetchTopCustomers, "topCustomers");
    addCases(fetchMonthlyOrderCount, "monthlyOrderCount");
    addCases(fetchOrderTypeDistribution, "orderTypeDistribution");
    addCases(fetchTopCustomersByRevenue, "topCustomersByRevenue");
    addCases(fetchMostSoldProducts, "mostSoldProducts");
    addCases(fetchMonthlyOrderRevenueTrend, "monthlyOrderRevenueTrend");
    addCases(fetchCustomerTypeDistribution, "customerTypeDistribution");
    addCases(fetchAverageOrderValueTrend, "averageOrderValueTrend");
    addCases(fetchCategoryWiseRevenue, "categoryWiseRevenue");
    addCases(fetchCustomerRegistrationTrend, "customerRegistrationTrend");
    addCases(fetchRecentActivity, "recentActivity");
    addCases(fetchRepeatVsNewCustomers, "repeatVsNewCustomers");
    addCases(fetchWeekdayOrderHeatmap, "weekdayOrderHeatmap");
    addCases(fetchCancelledOrdersStats, "cancelledOrdersStats");
    addCases(fetchLowStockProducts, "lowStockProducts");
    addCases(fetchCustomerSegments, "customerSegments");
    addCases(fetchRevenueByCity, "revenueByCity");
    addCases(fetchCustomerDistribution, "customerDistribution");
  },
});

export default analyticsSlice.reducer;
