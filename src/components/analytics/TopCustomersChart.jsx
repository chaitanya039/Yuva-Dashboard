import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { fetchTopCustomers } from "../../features/analyticsSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const TopCustomersChart = () => {
  const dispatch = useDispatch();
  const { topCustomers, loading, error } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchTopCustomers());
  }, [dispatch]);

  const labels = topCustomers.map((c) => c.name);
  const data = {
    labels,
    datasets: [
      {
        label: "Total Spent (₹)",
        data: topCustomers.map((c) => c.totalSpent),
        backgroundColor: "rgba(54, 162, 235, 0.6)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `₹ ${ctx.raw}` } },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  if (loading) return <p>Loading top customers...</p>;
  if (error) return <p>Error: {error}</p>;
  if (!topCustomers.length) return <p>No data available</p>;

  return (
    <div className="bg-white p-4 rounded shadow">
      <h2 className="text-xl font-semibold mb-2">Top Customers by Revenue</h2>
      <Bar data={data} options={options} height={250}  />
    </div>
  );
};

export default TopCustomersChart;