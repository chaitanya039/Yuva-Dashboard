import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from "chart.js";
import { Line } from "react-chartjs-2";
import { fetchRevenueVsExpense } from "../../features/analyticsSlice";

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const RevenueVsExpenseChart = () => {
  const dispatch = useDispatch();
  const { revenueVsExpense, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchRevenueVsExpense({ year: new Date().getFullYear() }));
  }, [dispatch]);

  const labels = revenueVsExpense.map((item) => item.label);

  const data = {
    labels,
    datasets: [
      {
        label: "Revenue",
        data: revenueVsExpense.map((item) => item.Revenue),
        borderColor: "rgba(75, 192, 192, 1)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        fill: true,
        tension: 0.4,
      },
      {
        label: "Expense",
        data: revenueVsExpense.map((item) => item.Expense),
        borderColor: "rgba(255, 99, 132, 1)",
        backgroundColor: "rgba(255, 99, 132, 0.2)",
        fill: true,
        tension: 0.4,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "top",
      },
      title: {
        display: true,
        text: "Monthly Revenue vs Expense",
      },
    },
  };

  if (loading) return <p>Loading chart...</p>;

  return (
    
    <div className="bg-white w-full h-full p-5 rounded shadow">
          <h2 className="text-lg font-semibold mb-5">Revenue Vs Expenses (Monthly)</h2>

      <Line data={data} options={options} />
    </div>
  );
};

export default RevenueVsExpenseChart;