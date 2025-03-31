import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchNetProfitTrend } from "../../features/analyticsSlice";

ChartJS.register(LineElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend);

const NetProfitTrendChart = () => {
  const dispatch = useDispatch();
  const { netProfitTrend, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchNetProfitTrend());
  }, [dispatch]);

  const data = {
    labels: netProfitTrend.map((d) => d.label),
    datasets: [
      {
        label: "Revenue",
        data: netProfitTrend.map((d) => d.Revenue),
        borderColor: "#4caf50",
        backgroundColor: "rgba(76, 175, 80, 0.1)",
        tension: 0.4,
      },
      {
        label: "Expense",
        data: netProfitTrend.map((d) => d.Expense),
        borderColor: "#f44336",
        backgroundColor: "rgba(244, 67, 54, 0.1)",
        tension: 0.4,
      },
      {
        label: "Profit",
        data: netProfitTrend.map((d) => d.Profit),
        borderColor: "#2196f3",
        backgroundColor: "rgba(33, 150, 243, 0.1)",
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
    },
  };

  return (
    <div className="bg-white p-5 rounded-xl shadow-md w-full">
      <h2 className="text-lg font-semibold mb-4">Net Profit Trend (Monthly)</h2>
      {loading ? <p>Loading...</p> : <Line data={data} options={options} />}
    </div>
  );
};

export default NetProfitTrendChart;