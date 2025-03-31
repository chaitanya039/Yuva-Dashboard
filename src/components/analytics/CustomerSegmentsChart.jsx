import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerSegments } from "../../features/analyticsSlice";
import { Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(ArcElement, Tooltip, Legend);

const CustomerSegmentsChart = () => {
  const dispatch = useDispatch();
  const { customerSegments, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchCustomerSegments());
  }, [dispatch]);

  if (loading || !customerSegments) return <div>Loading...</div>;

  const labels = customerSegments.map((s) => s.segment);
  const dataValues = customerSegments.map((s) => s.count);

  const data = {
    labels,
    datasets: [
      {
        data: dataValues,
        backgroundColor: ["#0ea5e9", "#22c55e", "#f97316"],
        borderWidth: 1,
      },
    ],
  };

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-sm">
      <h2 className="text-lg font-semibold mb-4">Customer Segments</h2>
      <Doughnut data={data} />
    </div>
  );
};

export default CustomerSegmentsChart;
