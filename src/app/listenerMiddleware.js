import { createListenerMiddleware } from "@reduxjs/toolkit";

// Source Slice Actions (TRIGGERS)
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../features/categorySlice";

import {
  createProduct,
  updateProduct,
  deleteProduct,
  fetchProducts,
} from "../features/productSlice";

import {
  createOrder,
  deleteOrder,
  updateOrder,
  fetchRecentOrders,
} from "../features/orderSlice";

import {
  createExpense,
  deleteExpense,
} from "../features/expenseSlice";

import {
  updateProductStock,
  fetchInventoryOverview,
  fetchMostUpdatedProducts,
  fetchLowStockProducts,
  fetchOrderSnapshot,
  fetchRecentStockUpdates,
  fetchStockActivityChartData,
} from "../features/inventorySlice";

import {
  fetchKPIStats,
  fetchExpenseBreakdown,
  fetchSalesByCategory,
  fetchRevenueBreakdown,
  fetchRevenueVsExpense,
} from "../features/analyticsSlice";

import { fetchTopSellingProducts } from "../features/reportSlice";
import { fetchCategories } from "../features/categorySlice";

const listenerMiddleware = createListenerMiddleware();

listenerMiddleware.startListening({
  matcher: (action) =>
    [
      // Category TRIGGERS
      createCategory.fulfilled.type,
      updateCategory.fulfilled.type,
      deleteCategory.fulfilled.type,

      // Product Triggers
      createProduct.fulfilled.type,
      updateProduct.fulfilled.type,
      deleteProduct.fulfilled.type,

      // Order Triggers
      createOrder.fulfilled.type,
      updateOrder.fulfilled.type,
      deleteOrder.fulfilled.type,

      // Expense Triggers
      createExpense.fulfilled.type,
      deleteExpense.fulfilled.type,

      // Inventory Trigger
      updateProductStock.fulfilled.type, // ✅ stock updated
    ].includes(action.type),
  effect: async (_, api) => {
    // Refresh analytics
    await api.dispatch(fetchKPIStats());
    await api.dispatch(fetchExpenseBreakdown());
    await api.dispatch(fetchSalesByCategory());
    await api.dispatch(fetchRevenueBreakdown({ type: "monthly" }));
    await api.dispatch(fetchRevenueVsExpense({ year: new Date().getFullYear() }));

    // Refresh reports
    await api.dispatch(fetchTopSellingProducts());

    // Refresh general listings
    await api.dispatch(fetchProducts());
    await api.dispatch(fetchCategories());
    await api.dispatch(fetchRecentOrders());

    // Refresh inventory
    await api.dispatch(fetchInventoryOverview());
    await api.dispatch(fetchMostUpdatedProducts());
    await api.dispatch(fetchLowStockProducts());
    await api.dispatch(fetchOrderSnapshot());
    await api.dispatch(fetchRecentStockUpdates());
    await api.dispatch(fetchStockActivityChartData());
  },
});

export default listenerMiddleware;
