import React from "react";
import { Pie } from "react-chartjs-2";
import { useSelector } from "react-redux";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const SalesByCategoryChart = () => {
  const { salesByCategory, loading } = useSelector((state) => state.analytics);

  if (loading || !salesByCategory.length) return <p>Loading...</p>;

  const data = {
    labels: salesByCategory.map((e) => e.category),
    datasets: [
      {
        label: "Sales % ",
        data: salesByCategory.map((e) => parseFloat(e.percent)),
        backgroundColor: [
          "#36A2EB",
          "#FF6384",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white rounded-xl shadow p-5">
      <h2 className="text-lg font-semibold mb-2">Sales by Category</h2>
      <Pie data={data} />
    </div>
  );
};

export default SalesByCategoryChart;
