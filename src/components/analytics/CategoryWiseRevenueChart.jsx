import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCategoryWiseRevenue } from "../../features/analyticsSlice";
import { Pie } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CategoryWiseRevenueChart = () => {
  const dispatch = useDispatch();
  const { categoryWiseRevenue, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchCategoryWiseRevenue());
  }, [dispatch]);

  const chartData = {
    labels: categoryWiseRevenue.map((entry) => entry.category),
    datasets: [
      {
        label: "Revenue (₹)",
        data: categoryWiseRevenue.map((entry) => entry.totalRevenue),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
          "#FFCE56",
          "#4BC0C0",
          "#9966FF",
          "#FF9F40",
          "#66D17D",
          "#D36BFF",
          "#F56C6C",
          "#00C49F",
        ],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow">
      <h2 className="text-lg font-semibold mb-4">Revenue by Product Category</h2>
      {loading ? <p>Loading...</p> : <Pie data={chartData} />}
    </div>
  );
};

export default CategoryWiseRevenueChart;
