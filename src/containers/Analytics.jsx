import React, { useState } from "react";
import AverageOrderValueTrendChart from "../components/analytics/AverageOrderValueTrendChart";
import CancelledOrdersStats from "../components/analytics/CancelledOrdersStats";
import CategoryWiseRevenueChart from "../components/analytics/CategoryWiseRevenueChart";
import CustomerRegistrationTrendChart from "../components/analytics/CustomerRegistrationTrendChart";
import CustomerSegmentsChart from "../components/analytics/CustomerSegmentsChart";
import CustomerTypeDistributionChart from "../components/analytics/CustomerTypeDistributionChart";
import ExpenseBreakdownChart from "../components/analytics/ExpenseBreakdownChart";
import KPIStats from "../components/analytics/KPIStats";
import MonthlyOrderRevenueTrendChart from "../components/analytics/MonthlyOrderRevenueTrendChart";
import MostSoldProductsChart from "../components/analytics/MostSoldProductsChart";
import NetProfitTrendChart from "../components/analytics/NetProfitTrendChart";
import RecentActivityPanel from "../components/analytics/RecentActivityPanel";
import RepeatVsNewCustomersChart from "../components/analytics/RepeatVsNewCustomersChart";
import RevenueBreakdownChart from "../components/analytics/RevenueBreakdownChart";
import RevenueByCityChart from "../components/analytics/RevenueByCityChart";
import RevenueVsExpenseChart from "../components/analytics/RevenueVsExpense";
import SalesByCategoryChart from "../components/analytics/SalesbyCategory";
import TopCustomersChart from "../components/analytics/TopCustomersChart";
import WeekdayOrderHeatmapChart from "../components/analytics/WeekdayOrderHeatmapChart";
import CustomerDistributionMap from "../components/analytics/CustomerDistributionMap";

const Analytics = () => {
  const [activeTab, setActiveTab] = useState("revenue");

  const tabs = [
    { label: "Revenue & Expenses", key: "revenue" },
    { label: "Customers", key: "customers" },
    { label: "Orders", key: "orders" },
    { label: "Geo & Activity", key: "geo" },
  ];

  return (
    <div
      className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8 space-y-8 w-full"
      id="analytics"
    >
      {/* 🧭 Breadcrumb + Header */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-sm text-gray-500">
            <a href="#dashboard" className="inline">
              Dashboard
            </a>{" "}
            &gt; <span className="text-gray-700 font-medium">Analytics</span>
          </p>
          <h1 className="text-2xl font-bold text-gray-800 mt-1">
            Analytics Overview
          </h1>
        </div>
      </div>

      {/* 🔢 KPI Stats */}
      <KPIStats />

      {/* 🗂️ Tabs */}
      <div className="flex gap-4 mb-4 border-b">
        {tabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={`text-sm cursor-pointer px-4 py-2 rounded-t-md font-medium ${
              activeTab === tab.key
                ? "bg-white border border-b-0 shadow text-blue-600"
                : "bg-gray-100 text-gray-600"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 🧩 Tab Content */}
      {activeTab === "revenue" && (
        <div className="space-y-8">
          {/* 🔹 Top: Bar/Line Charts in 2 columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <RevenueBreakdownChart />
            <RevenueVsExpenseChart />
            <AverageOrderValueTrendChart />
            <NetProfitTrendChart />
          </div>

          {/* 🔸 Bottom: Pie Charts in 3 columns on large screens */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <ExpenseBreakdownChart />
            <SalesByCategoryChart />
            <CategoryWiseRevenueChart />
          </div>
        </div>
      )}

      {activeTab === "customers" && (
        <div>
          {/* 🔹 First Section: 2-Wide Charts */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <TopCustomersChart />
              <CustomerRegistrationTrendChart />
          </div>

          {/* 🔸 Second Section: 3-Wide Charts */}
          <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 mt-6">
            <CustomerSegmentsChart />
            <CustomerTypeDistributionChart />
            <RepeatVsNewCustomersChart />
          </div>
          <div>
            <CustomerDistributionMap />
          </div>
        </div>
      )}

      {activeTab === "orders" && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <MonthlyOrderRevenueTrendChart />
          <MostSoldProductsChart />
          <WeekdayOrderHeatmapChart />
          <CancelledOrdersStats />
        </div>
      )}

      {activeTab === "geo" && (
        <div className="grid grid-cols-1 md:grid-cols-1 gap-6">
          <RevenueByCityChart />
          <RecentActivityPanel />
        </div>
      )}
    </div>
  );
};

export default Analytics;
