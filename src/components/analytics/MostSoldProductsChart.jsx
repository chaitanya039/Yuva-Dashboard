import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Bar } from "react-chartjs-2";
import { fetchMostSoldProducts } from "../../features/analyticsSlice";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

const MostSoldProductsChart = () => {
  const dispatch = useDispatch();
  const { mostSoldProducts, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchMostSoldProducts());
  }, [dispatch]);

  const chartData = {
    labels: mostSoldProducts.map((item) => item.product.name),
    datasets: [
      {
        label: "Quantity Sold",
        data: mostSoldProducts.map((item) => item.quantity),
        backgroundColor: "rgba(54, 162, 235, 0.7)",
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: { display: false },
      tooltip: { callbacks: { label: (ctx) => `Qty: ${ctx.raw}` } },
    },
    scales: {
      y: {
        beginAtZero: true,
        title: { display: true, text: "Quantity" },
      },
      x: {
        ticks: {
          autoSkip: false,
          maxRotation: 45,
          minRotation: 30,
        },
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full">
      <h2 className="text-lg font-semibold mb-4">Most Sold Products</h2>
      {loading ? <p>Loading...</p> : <Bar data={chartData} options={options} />}
    </div>
  );
};

export default MostSoldProductsChart;
