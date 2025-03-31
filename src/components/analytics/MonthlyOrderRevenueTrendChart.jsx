import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { fetchMonthlyOrderRevenueTrend } from "../../features/analyticsSlice";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const MonthlyOrderRevenueTrendChart = () => {
  const dispatch = useDispatch();
  const { monthlyOrderRevenueTrend, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchMonthlyOrderRevenueTrend({ year: new Date().getFullYear() }));
  }, [dispatch]);

  const chartData = {
    labels: monthlyOrderRevenueTrend.map((item) => item.label),
    datasets: [
      {
        label: "Revenue (₹)",
        data: monthlyOrderRevenueTrend.map((item) => item.revenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.4,
        fill: true,
      },
      {
        label: "Orders",
        data: monthlyOrderRevenueTrend.map((item) => item.orders),
        borderColor: "rgba(153, 102, 255, 1)",
        backgroundColor: "rgba(153, 102, 255, 0.2)",
        tension: 0.4,
        fill: true,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      tooltip: {
        mode: "index",
        intersect: false,
      },
    },
    interaction: {
      mode: "nearest",
      axis: "x",
      intersect: false,
    },
    scales: {
      y: {
        beginAtZero: true,
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">
      <h2 className="text-lg font-semibold mb-4">Monthly Revenue & Order Trend</h2>
      {loading ? <p>Loading...</p> : <Line data={chartData} options={options} />}
    </div>
  );
};

export default MonthlyOrderRevenueTrendChart;
