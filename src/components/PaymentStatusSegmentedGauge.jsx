import React from "react";

const PaymentStatusSegmentedGauge = ({ distribution = [] }) => {
  const total = distribution.reduce((acc, item) => acc + item.count, 0) || 1;

  const colors = {
    Paid: "bg-green-600",
    "Partially Paid": "bg-yellow-400",
    Unpaid: "bg-red-500",
  };

  // Bubble size scale
  const minSize = 60;
  const maxSize = 140;

  return (
    <div className="flex flex-wrap justify-center gap-6 py-4">
      {distribution.map((item, idx) => {
        const { status, count } = item;
        const fraction = count / total;
        const size = Math.max(minSize, fraction * maxSize + minSize); // ensures minimum size

        return (
          <div
            key={idx}
            className={`flex flex-col items-center justify-center ${colors[status] || "bg-gray-400"} text-white rounded-full shadow-md transition-transform hover:scale-105`}
            style={{
              width: `${size}px`,
              height: `${size}px`,
            }}
          >
            <div className="text-sm font-semibold">{status === "Partially Paid" ? "Partially" : status}</div>
            <div className="text-xs font-light">{count} ({(fraction * 100).toFixed(1)}%)</div>
          </div>
        );
      })}
    </div>
  );
};

export default PaymentStatusSegmentedGauge;
