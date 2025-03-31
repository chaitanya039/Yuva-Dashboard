import React, { useEffect, useState } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import { fetchRevenueBreakdown } from "../../features/analyticsSlice";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;

const RevenueBreakdownChart = () => {
  const dispatch = useDispatch();
  const revenueBreakdown = useSelector((state) => state.analytics.revenueBreakdown);

  const [type, setType] = useState("monthly");
  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());

  const years = Array.from({ length: 5 }, (_, i) => getCurrentYear() - 4 + i);
  const months = [
    { name: "Jan", value: 1 }, { name: "Feb", value: 2 }, { name: "Mar", value: 3 },
    { name: "Apr", value: 4 }, { name: "May", value: 5 }, { name: "Jun", value: 6 },
    { name: "Jul", value: 7 }, { name: "Aug", value: 8 }, { name: "Sep", value: 9 },
    { name: "Oct", value: 10 }, { name: "Nov", value: 11 }, { name: "Dec", value: 12 }
  ];

  useEffect(() => {
    const params =
      type === "daily"
        ? { type, year, month }
        : type === "monthly"
        ? { type, year }
        : { type };
    dispatch(fetchRevenueBreakdown(params));
  }, [type, year, month]);

  const labels = revenueBreakdown.map((item) => item.label);
  const chartData = {
    labels,
    datasets: [
      {
        label: "Retailer",
        data: revenueBreakdown.map((item) => item.Retailer),
        backgroundColor: "#10B981",
      },
      {
        label: "Wholesaler",
        data: revenueBreakdown.map((item) => item.Wholesaler),
        backgroundColor: "#3B82F6",
      },
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: { position: "top" },
      tooltip: {
        callbacks: {
          label: (ctx) => `${ctx.dataset.label}: ₹${ctx.raw.toLocaleString("en-IN")}`,
        },
      },
    },
    scales: {
      x: {
        stacked: true,
        title: {
          display: true,
          text: type.charAt(0).toUpperCase() + type.slice(1),
        },
      },
      y: {
        stacked: true,
        beginAtZero: true,
        title: {
          display: true,
          text: "Revenue (₹)",
        },
        ticks: {
          callback: (val) => `₹${val.toLocaleString("en-IN")}`,
        },
      },
    },
  };

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold text-gray-800">
          Revenue Breakdown ({type.charAt(0).toUpperCase() + type.slice(1)})
        </h3>
        <div className="flex space-x-2">
          {["daily", "monthly", "yearly"].map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1 text-xs rounded-full ${
                type === t ? "bg-blue-600 text-white" : "bg-gray-200 text-gray-700"
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 mb-4">
        {(type === "monthly" || type === "daily") && (
          <select
            className="text-sm border rounded px-2 py-1"
            value={year}
            onChange={(e) => setYear(+e.target.value)}
          >
            {years.map((y) => (
              <option key={y} value={y}>
                {y}
              </option>
            ))}
          </select>
        )}
        {type === "daily" && (
          <select
            className="text-sm border rounded px-2 py-1"
            value={month}
            onChange={(e) => setMonth(+e.target.value)}
          >
            {months.map((m) => (
              <option key={m.value} value={m.value}>
                {m.name}
              </option>
            ))}
          </select>
        )}
      </div>

      <div className="h-full w-[91%]">
        <Bar data={chartData} options={chartOptions} />
      </div>
    </div>
  );
};

export default RevenueBreakdownChart;
