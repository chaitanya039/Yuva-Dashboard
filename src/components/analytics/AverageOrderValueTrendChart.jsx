import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import { fetchAverageOrderValueTrend } from "../../features/analyticsSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend
);

const AverageOrderValueTrendChart = () => {
  const dispatch = useDispatch();
  const { averageOrderValueTrend, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchAverageOrderValueTrend());
  }, [dispatch]);

  const chartData = {
    labels: averageOrderValueTrend.map((entry) => entry.label),
    datasets: [
      {
        label: "Avg. Order Value",
        data: averageOrderValueTrend.map((entry) => entry.averageOrderValue),
        borderColor: "rgba(75, 192, 192, 1)",
        fill: false,
        tension: 0.3,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: {
          display: true,
          text: "₹ Value",
        },
      },
    },
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Avg. Order Value Trend</h2>
      {loading ? <p>Loading...</p> : <Line data={chartData} options={options} />}
    </div>
  );
};

export default AverageOrderValueTrendChart;
