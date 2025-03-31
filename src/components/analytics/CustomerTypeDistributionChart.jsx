import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Doughnut } from "react-chartjs-2";
import { fetchCustomerTypeDistribution } from "../../features/analyticsSlice";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerTypeDistributionChart = () => {
  const dispatch = useDispatch();
  const { customerTypeDistribution, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchCustomerTypeDistribution());
  }, [dispatch]);

  const chartData = {
    labels: customerTypeDistribution.map((item) => item.type),
    datasets: [
      {
        label: "Customers",
        data: customerTypeDistribution.map((item) => item.count),
        backgroundColor: [
          "rgba(54, 162, 235, 0.6)",
          "rgba(255, 206, 86, 0.6)",
        ],
        borderColor: [
          "rgba(54, 162, 235, 1)",
          "rgba(255, 206, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: "bottom",
      },
    },
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Customer Type Distribution</h2>
      {loading ? <p>Loading...</p> : <Doughnut data={chartData} options={options} />}
    </div>
  );
};

export default CustomerTypeDistributionChart;
