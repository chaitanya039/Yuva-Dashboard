import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchKPIStats } from "../../features/analyticsSlice";
import {
  FaChartLine,
  FaShoppingBag,
  FaBoxOpen,
  FaMoneyBillWave,
} from "react-icons/fa";
import { GiProfit } from "react-icons/gi";

const StatBox = ({
  icon: Icon,
  label,
  value,
  change,
  color = "text-blue-600",
}) => {
  return (
    <div className="w-full bg-white shadow-sm border rounded-2xl p-4 flex flex-col gap-2">
      <div className="flex items-center justify-between">
        <div className={`text-2xl ${color}`}>
          <Icon />
        </div>
        {change !== undefined && (
          <span
            className={`text-sm font-semibold ${
              change >= 0 ? "text-green-600" : "text-red-500"
            }`}
          >
            {change >= 0 ? "+" : ""}
            {change?.toFixed(1)}%
          </span>
        )}
      </div>
      <h4 className="text-sm font-medium text-gray-500">{label}</h4>
      <h2 className="text-xl font-bold text-gray-900">
        {value?.toLocaleString("en-IN")}
      </h2>
    </div>
  );
};

const KPIStats = () => {
  const dispatch = useDispatch();
  const { kpi, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchKPIStats());
  }, [dispatch]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!kpi) return null;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-5 gap-4 mb-8">
      <StatBox
        icon={FaChartLine}
        label="Total Revenue"
        value={`₹${kpi.totalRevenue}`}
        change={kpi.monthlyGrowthPercent}
      />
      <StatBox
        icon={FaShoppingBag}
        label="Total Orders"
        value={kpi.totalOrders}
        change={kpi.monthlyOrderGrowthPercent}
        color="text-purple-600"
      />
      <StatBox
        icon={FaBoxOpen}
        label="Low Stock Items"
        value={kpi.inventoryLowStockCount}
        change={kpi.lowStockGrowthPercent}
        color="text-orange-600"
      />
      <StatBox
        icon={GiProfit}
        label="Net Profit"
        value={`₹${kpi.netProfit}`}
        color="text-green-700"
      />
      <StatBox
        icon={FaMoneyBillWave}
        label="Total Expenses"
        value={`₹${kpi.totalExpenses}`}
        color="text-red-600"
      />
    </div>
  );
};

export default KPIStats;
