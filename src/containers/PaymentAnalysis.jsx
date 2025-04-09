import React, { useEffect } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title,
} from "chart.js";
import { Line, Doughnut } from "react-chartjs-2";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchTotalRevenueCollected,
  fetchOutstandingBalance,
  fetchAvgRecoveryPercentage,
  fetchPaymentStatusDistribution,
  fetchDiscountStats,
  fetchMonthlyCollectionTrend,
  fetchTopCustomerPaymentBehavior,
  fetchPartialPayments,
} from "../features/paymentSlice";
import RevenueByCityHeatmap from "../components/analytics/RevenueByCityChart";
import { Link } from "react-router-dom";
import PaymentStatusLiquidGauges from "../components/PaymentStatusSegmentedGauge";
import PaymentStatusSegmentedGauge from "../components/PaymentStatusSegmentedGauge";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  ArcElement,
  Tooltip,
  Legend,
  Title
);

const Section = ({ title, children }) => (
  <div className="bg-white rounded-xl shadow-md p-5 w-full border border-gray-200">
    <h3 className="text-lg font-semibold mb-3 text-gray-700">{title}</h3>
    {children}
  </div>
);

const PaymentAnalysis = () => {
  const dispatch = useDispatch();
  const {
    totalRevenueCollected = 0,
    outstandingBalance = 0,
    avgRecoveryPercentage = 0,
    paymentStatusDistribution = [],
    discountStats = {},
    monthlyCollectionTrend = [],
    topCustomerBehavior = [],
    highDueCustomers = [],
  } = useSelector((state) => state.payment);

  useEffect(() => {
    dispatch(fetchTotalRevenueCollected());
    dispatch(fetchOutstandingBalance());
    dispatch(fetchAvgRecoveryPercentage());
    dispatch(fetchPaymentStatusDistribution());
    dispatch(fetchDiscountStats());
    dispatch(fetchMonthlyCollectionTrend());
    dispatch(fetchTopCustomerPaymentBehavior());
    dispatch(fetchPartialPayments());
  }, [dispatch]);


  const lineData = {
    labels: monthlyCollectionTrend.map((d) => d.month),
    datasets: [
      {
        label: "Monthly Collected Revenue",
        data: monthlyCollectionTrend.map((d) => d.total),
        fill: false,
        borderColor: "#6366F1",
        tension: 0.3,
      },
    ],
  };

  return (
    <div className="space-y-6">
      <div className="text-sm text-gray-400">
        <Link to={"/"}>Dashboard</Link> {">"}{" "}
        <span className="text-gray-600 font-medium">Payments</span>
        <h2 className="text-2xl font-bold text-gray-800">Payment Analysis</h2>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <Section title="Collected Revenue">
          <p className="text-3xl font-bold text-green-700">
            ₹ {totalRevenueCollected.toLocaleString()}
          </p>
        </Section>
        <Section title="Outstanding Balance">
          <p className="text-3xl font-bold text-red-600">
            ₹ {outstandingBalance.toLocaleString()}
          </p>
        </Section>
        <Section title="Recovery %">
          <p className="text-3xl font-bold text-blue-600">
            {avgRecoveryPercentage} %
          </p>
        </Section>
        <Section title="Discount % to Revenue">
          <p className="text-3xl font-bold text-yellow-500">
            {(discountStats.discountToRevenueRatio ?? 0).toFixed(2)}%
          </p>
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Section title="Payment Status Overview">
          <PaymentStatusSegmentedGauge
            distribution={paymentStatusDistribution}
          />
        </Section>

        <Section title="Monthly Revenue Trend">
          <Line data={lineData} />
        </Section>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  {/* Top Paying Customers Table */}
  <Section title="Top Paying Customers">
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white mt-1 rounded-lg shadow-lg">
        <thead>
          <tr className="bg-green-800 text-sm text-white">
            <th className="px-6 py-2 text-left uppercase tracking-wider">Customer</th>
            <th className="px-6 py-2 text-right uppercase tracking-wider">Total Paid</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {topCustomerBehavior.slice(0, 5).map((cust, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-50 text-sm transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-600">{cust.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-normal text-right font-semibold">
                ₹ {cust.totalPaid.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Section>

  {/* High Due Customers Table */}
  <Section title="High Due Customers">
    <div className="overflow-x-auto">
      <table className="min-w-full mt-1 bg-white rounded-lg shadow-lg">
        <thead>
          <tr className="bg-red-800 text-sm text-white">
            <th className="px-6 py-2  text-left uppercase tracking-wider">Customer</th>
            <th className="px-6 py-2 text-right uppercase tracking-wider">Amount Due</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {highDueCustomers.slice(0, 5).map((cust, idx) => (
            <tr
              key={idx}
              className="hover:bg-gray-50 text-sm transition-colors"
            >
              <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-700">{cust.name}</td>
              <td className="px-6 py-4 whitespace-nowrap text-right font-semibold text-red-700">
                ₹ {cust.totalDue.toLocaleString()}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  </Section>
</div>

    </div>
  );
};

export default PaymentAnalysis;
