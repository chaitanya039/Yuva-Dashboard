import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchWeekdayOrderHeatmap } from "../../features/analyticsSlice";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Title,
  Legend,
} from "chart.js";
import { Bar } from "react-chartjs-2";

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Title, Legend);

const WeekdayOrderHeatmapChart = () => {
  const dispatch = useDispatch();
  const { weekdayOrderHeatmap, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchWeekdayOrderHeatmap());
  }, [dispatch]);

  const data = {
    labels: weekdayOrderHeatmap.map((entry) => entry.day),
    datasets: [
      {
        label: "Orders",
        data: weekdayOrderHeatmap.map((entry) => entry.count),
        backgroundColor: "#36A2EB",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
    },
    scales: {
      y: { beginAtZero: true },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-2xl">
      <h2 className="text-lg font-semibold mb-4">Orders by Weekday</h2>
      {loading ? <p>Loading...</p> : <Bar data={data} options={options} />}
    </div>
  );
};

export default WeekdayOrderHeatmapChart;
