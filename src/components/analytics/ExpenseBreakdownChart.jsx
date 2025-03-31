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

const ExpenseBreakdownChart = () => {
  const { expenseBreakdown, loading } = useSelector((state) => state.analytics);

  if (loading || !expenseBreakdown.length) return <p>Loading...</p>;

  const data = {
    labels: expenseBreakdown.map((e) => e.category),
    datasets: [
      {
        label: "Expenses",
        data: expenseBreakdown.map((e) => e.amount),
        backgroundColor: [
          "#FF6384",
          "#36A2EB",
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
      <h2 className="text-lg font-semibold mb-2">Expense Breakdown</h2>
      <Pie data={data} />
    </div>
  );
};

export default ExpenseBreakdownChart;
