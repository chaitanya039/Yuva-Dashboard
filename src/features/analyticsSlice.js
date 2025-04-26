// src/features/analyticsSlice.js
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
export const fetchCustomerDistribution = createGetThunk("analytics/fetchCustomerDistribution", "/analytics/customer-distribution");

// Mapping keys to thunks
const analyticsThunks = {
  kpi: fetchKPIStats,
  revenueBreakdown: fetchRevenueBreakdown,
  expenseBreakdown: fetchExpenseBreakdown,
  salesByCategory: fetchSalesByCategory,
  revenueVsExpense: fetchRevenueVsExpense,
  netProfitTrend: fetchNetProfitTrend,
  topCustomers: fetchTopCustomers,
  monthlyOrderCount: fetchMonthlyOrderCount,
  orderTypeDistribution: fetchOrderTypeDistribution,
  topCustomersByRevenue: fetchTopCustomersByRevenue,
  mostSoldProducts: fetchMostSoldProducts,
  monthlyOrderRevenueTrend: fetchMonthlyOrderRevenueTrend,
  customerTypeDistribution: fetchCustomerTypeDistribution,
  averageOrderValueTrend: fetchAverageOrderValueTrend,
  categoryWiseRevenue: fetchCategoryWiseRevenue,
  customerRegistrationTrend: fetchCustomerRegistrationTrend,
  recentActivity: fetchRecentActivity,
  repeatVsNewCustomers: fetchRepeatVsNewCustomers,
  weekdayOrderHeatmap: fetchWeekdayOrderHeatmap,
  cancelledOrdersStats: fetchCancelledOrdersStats,
  lowStockProducts: fetchLowStockProducts,
  customerSegments: fetchCustomerSegments,
  revenueByCity: fetchRevenueByCity,
  customerDistribution: fetchCustomerDistribution,
};

// ============================
// 📊 INITIAL STATE
// ============================
const initialState = {
  // Data states
  kpi: null,
  revenueBreakdown: [],
  expenseBreakdown: [],
  salesByCategory: [],
  revenueVsExpense: [],
  netProfitTrend: [],
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
  customerDistribution: [],

  // Loading states
  kpiLoading: false,
  revenueBreakdownLoading: false,
  expenseBreakdownLoading: false,
  salesByCategoryLoading: false,
  revenueVsExpenseLoading: false,
  netProfitTrendLoading: false,
  topCustomersLoading: false,
  monthlyOrderCountLoading: false,
  orderTypeDistributionLoading: false,
  topCustomersByRevenueLoading: false,
  mostSoldProductsLoading: false,
  monthlyOrderRevenueTrendLoading: false,
  customerTypeDistributionLoading: false,
  averageOrderValueTrendLoading: false,
  categoryWiseRevenueLoading: false,
  customerRegistrationTrendLoading: false,
  recentActivityLoading: false,
  repeatVsNewCustomersLoading: false,
  weekdayOrderHeatmapLoading: false,
  cancelledOrdersStatsLoading: false,
  lowStockProductsLoading: false,
  customerSegmentsLoading: false,
  revenueByCityLoading: false,
  customerDistributionLoading: false,

  // Error states
  kpiError: null,
  revenueBreakdownError: null,
  expenseBreakdownError: null,
  salesByCategoryError: null,
  revenueVsExpenseError: null,
  netProfitTrendError: null,
  topCustomersError: null,
  monthlyOrderCountError: null,
  orderTypeDistributionError: null,
  topCustomersByRevenueError: null,
  mostSoldProductsError: null,
  monthlyOrderRevenueTrendError: null,
  customerTypeDistributionError: null,
  averageOrderValueTrendError: null,
  categoryWiseRevenueError: null,
  customerRegistrationTrendError: null,
  recentActivityError: null,
  repeatVsNewCustomersError: null,
  weekdayOrderHeatmapError: null,
  cancelledOrdersStatsError: null,
  lowStockProductsError: null,
  customerSegmentsError: null,
  revenueByCityError: null,
  customerDistributionError: null,
};

// ============================
// 📊 SLICE
// ============================
const analyticsSlice = createSlice({
  name: "analytics",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    Object.entries(analyticsThunks).forEach(([key, thunk]) => {
      builder
        .addCase(thunk.pending, (state) => {
          state[`${key}Loading`] = true;
          state[`${key}Error`] = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state[`${key}Loading`] = false;
          state[key] = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state[`${key}Loading`] = false;
          state[`${key}Error`] = action.payload;
        });
    });
  },
});

export default analyticsSlice.reducer;
