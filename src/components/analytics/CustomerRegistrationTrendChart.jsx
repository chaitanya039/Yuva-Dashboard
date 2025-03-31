import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCustomerRegistrationTrend } from "../../features/analyticsSlice";
import {
  Chart as ChartJS,
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js";
import { Line } from "react-chartjs-2";
import { FaChartLine } from "react-icons/fa";

ChartJS.register(
  LineElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
);

const CustomerRegistrationTrendChart = () => {
  const dispatch = useDispatch();
  const { customerRegistrationTrend, loading } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchCustomerRegistrationTrend());
  }, [dispatch]);

  const labels = customerRegistrationTrend.map((entry) => entry.label);
  const dataPoints = customerRegistrationTrend.map((entry) => entry.registered);

  // 🧠 Dynamic Insight
  const maxVal = Math.max(...dataPoints);
  const peakIndex = dataPoints.indexOf(maxVal);
  const peakMonth = labels[peakIndex];

  const data = {
    labels,
    datasets: [
      {
        label: "Registrations",
        data: dataPoints,
        fill: true,
        borderColor: "#DE3163",
        backgroundColor: "rgba(222, 49, 99, 0.1)",
        tension: 0.4,
        pointBackgroundColor: "#DE3163",
        pointBorderColor: "#fff",
      },
    ],
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow w-full">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2 mb-4">
          Customer Registration Trend
        </h2>
      </div>

      {loading ? (
        <p className="text-sm text-gray-500">Loading...</p>
      ) : (
        <div className="h-[320px]">
          <Line data={data} />
        </div>
      )}

      {/* 📊 Dynamic Insight Box */}
      {!loading && (
        <div className="bg-gray-50 border-l-4 border-pink-500 px-4 py-4 rounded-xl shadow-sm space-y-2 text-sm text-gray-700">
          <p>
            <strong>📈 Peak Month:&nbsp;&nbsp;</strong>{" "}
            <span className="text-pink-600 font-semibold">{peakMonth}</span>{" "}
            with <span className="font-semibold">{maxVal}</span> registrations.
          </p>

          <p>
            <strong>📊 Total Registrations:&nbsp;&nbsp; </strong>{" "}
            <span className="text-green-600 font-semibold">
              {dataPoints.reduce((a, b) => a + b, 0)}
            </span>
          </p>

          <p>
            <strong>📅 Average Per Month:&nbsp;&nbsp;</strong>{" "}
            <span className="text-indigo-600 font-semibold">
              {(
                dataPoints.reduce((a, b) => a + b, 0) / dataPoints.length
              ).toFixed(2)}
            </span>
          </p>
        </div>
      )}
    </div>
  );
};

export default CustomerRegistrationTrendChart;
