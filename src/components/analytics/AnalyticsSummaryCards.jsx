// components/analytics/AnalyticsSummaryCards.jsx
import React from "react";

const cardStyle = "p-4 bg-white rounded-lg shadow-md text-center";

const AnalyticsSummaryCards = ({ stats }) => {
  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-6">
      <div className={cardStyle}>
        <h4 className="text-gray-500">Total Orders</h4>
        <p className="text-xl font-bold">{stats.totalOrders}</p>
      </div>
      <div className={cardStyle}>
        <h4 className="text-gray-500">Total Revenue</h4>
        <p className="text-xl font-bold">₹{stats.totalRevenue}</p>
      </div>
      <div className={cardStyle}>
        <h4 className="text-gray-500">Net Profit</h4>
        <p className="text-xl font-bold">₹{stats.netProfit}</p>
      </div>
      <div className={cardStyle}>
        <h4 className="text-gray-500">Sales Quantity</h4>
        <p className="text-xl font-bold">{stats.totalSalesQty}</p>
      </div>
    </div>
  );
};

export default AnalyticsSummaryCards;
