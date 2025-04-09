import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentOrders } from "../features/orderSlice";
import { fetchTopSellingProducts } from "../features/reportSlice";
import { KPI } from "../components/KPI";
import { SalesAnalyticsChart } from "../components/SalesAnalyticsChart";
import { RecentOrders } from "../components/RecentOrders";
import { SalesByCategory } from "../components/SalesByCategory";
import TopSellingProducts from "../components/TopSellingProducts";
import {
  fetchExpenseBreakdown,
  fetchSalesByCategory,
  fetchKPIStats,
  fetchRevenueBreakdown,
  fetchRevenueVsExpense, // ✅ Added
} from "../features/analyticsSlice";

// ✅ Recharts
import {
  AreaChart,
  Area,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import Products from "./Products";

const Dashboard = () => {
  const dispatch = useDispatch();

  const { kpi, revenueBreakdown, salesByCategory, revenueVsExpense } =
    useSelector((state) => state.analytics);
  const { recentOrders } = useSelector((state) => state.orders);
  const { topSelling } = useSelector((state) => state.reports);

  const [revenueParams, setRevenueParams] = useState({
    type: "monthly",
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
  });

  // Initial dispatch
  useEffect(() => {
    dispatch(fetchKPIStats());
    dispatch(fetchExpenseBreakdown());
    dispatch(fetchRecentOrders());
    dispatch(fetchTopSellingProducts());
    dispatch(fetchSalesByCategory());
    dispatch(fetchRevenueVsExpense({ year: new Date().getFullYear() })); // ✅
  }, [dispatch]);

  // For dynamic revenue breakdown
  useEffect(() => {
    dispatch(fetchRevenueBreakdown(revenueParams));
  }, [dispatch, revenueParams]);


  const categoryColors = [
    "#3B82F6",
    "#10B981",
    "#F59E0B",
    "#EF4444",
    "#8B5CF6",
    "#14B8A6",
  ];

  const formattedCategoryData = salesByCategory.map((item, index) => ({
    label: item.category,
    percent: parseFloat(item.percent),
    color: categoryColors[index % categoryColors.length],
  }));

  const revenueGrowth = kpi?.previousYearRevenue
    ? ((kpi?.totalRevenue - kpi?.previousYearRevenue) /
        kpi?.previousYearRevenue) *
      100
    : kpi?.totalRevenue > 0
    ? 100
    : 0;


  return (
    <div className="min-h-screen bg-gray-100" id="dashboard">
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>

      {/* Inventory + Chart */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6 mb-8">
        {/* KPI Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          <KPI
            title="Total Revenue"
            value={`₹${kpi?.totalRevenue || 0}`}
            percent={revenueGrowth.toFixed(2)}
            color="blue"
            label={`vs ${new Date().getFullYear() - 1}`}
          />
          <KPI
            title="Inventory Status"
            value={kpi?.inventoryLowStockCount || 0}
            percent={kpi?.lowStockGrowthPercent?.toFixed(2) || 0}
            color="red"
            label="Low stock"
          />
          <KPI
            title="Monthly Revenue"
            value={`₹${kpi?.monthlyRevenue || 0}`}
            percent={kpi?.monthlyGrowthPercent?.toFixed(2) || 0}
            color="green"
            label={new Date().toLocaleString("en-US", { month: "long" })}
          />
          <KPI
            title="Orders This Month"
            value={kpi?.currentMonthOrders || 0}
            percent={kpi?.monthlyOrderGrowthPercent?.toFixed(2) || 0}
            color="yellow"
            label={new Date().toLocaleString("en-US", { month: "long" })}
          />
        </div>

        {/* ✅ Revenue vs Expense Chart */}
        <div className="w-full bg-white rounded-lg shadow p-4">
          <h2 className="text-lg font-semibold mb-4">
            Monthly Revenue vs Expenses
          </h2>
          <ResponsiveContainer width="100%" height={250}>
            <AreaChart data={revenueVsExpense}>
              <defs>
                <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#10B981" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#10B981" stopOpacity={0} />
                </linearGradient>
                <linearGradient id="colorExpense" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366F1" stopOpacity={0.8} />
                  <stop offset="95%" stopColor="#6366F1" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="label" />
              <YAxis />
              <Tooltip />
              <CartesianGrid strokeDasharray="3 3" />
              <Area
                type="monotone"
                dataKey="Revenue"
                stroke="#10B981"
                fill="url(#colorRevenue)"
              />
              <Area
                type="monotone"
                dataKey="Expense"
                stroke="#6366F1"
                fill="url(#colorExpense)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      <div className="bg-white p-4 rounded-lg shadow flex items-center justify-between mb-8">
        <div>
          <h3 className="text-sm font-medium text-gray-600 mb-1">
            Total Sales Qty
          </h3>
          <p className="text-xs text-gray-500">All Time</p>
        </div>
        <div className="text-right">
          <p className="text-2xl font-bold text-indigo-600">
            {kpi?.totalSalesQty || 0}
          </p>
        </div>
      </div>

      {/* Sales Analytics + Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
        <div className="lg:col-span-2">
          <SalesAnalyticsChart
            data={revenueBreakdown}
            onFetch={setRevenueParams}
          />
        </div>
        <RecentOrders orders={recentOrders} />
      </div>

      {/* Insights */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <TopSellingProducts products={topSelling} />
        <SalesByCategory data={formattedCategoryData} />
      </div>
    </div>
  );
};

export default Dashboard;
