import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRepeatVsNewCustomers } from "../../features/analyticsSlice";
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Doughnut } from "react-chartjs-2";

ChartJS.register(ArcElement, Tooltip, Legend);

const RepeatVsNewCustomersChart = () => {
  const dispatch = useDispatch();
  const { repeatVsNewCustomers, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchRepeatVsNewCustomers());
  }, [dispatch]);

  const data = {
    labels: repeatVsNewCustomers.map((entry) => entry.type),
    datasets: [
      {
        label: "Customer Count",
        data: repeatVsNewCustomers.map((entry) => entry.count),
        backgroundColor: ["#4BC0C0", "#FF9F40"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-md">
      <h2 className="text-lg font-semibold mb-4">Repeat vs New Customers</h2>
      {loading ? <p>Loading...</p> : <Doughnut data={data} />}
    </div>
  );
};

export default RepeatVsNewCustomersChart;
