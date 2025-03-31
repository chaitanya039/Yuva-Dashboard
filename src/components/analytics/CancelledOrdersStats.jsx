import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchCancelledOrdersStats } from "../../features/analyticsSlice";
import { MdCancel } from "react-icons/md";

const CancelledOrdersStats = () => {
  const dispatch = useDispatch();
  const { cancelledOrdersStats, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchCancelledOrdersStats());
  }, [dispatch]);

  if (loading || !cancelledOrdersStats) {
    return (
      <div className="bg-white p-6 rounded-xl shadow w-full max-w-xs flex items-center justify-center h-40">
        <span className="text-sm text-gray-500">Loading stats...</span>
      </div>
    );
  }

  const { cancelled, total } = cancelledOrdersStats;
  const percent = total > 0 ? ((cancelled / total) * 100).toFixed(2) : 0;

  return (
    <div className="bg-white p-6 rounded-2xl shadow-md w-full max-w-xs flex flex-col items-center text-center border border-gray-100">
      <div className="text-5xl text-red-500 mb-3">
        <MdCancel />
      </div>
      <h2 className="text-lg font-semibold text-gray-800 mb-1">
        Cancelled / Rejected Orders
      </h2>
      <p className="text-3xl font-bold text-red-600">{cancelled}</p>
      <p className="text-sm text-gray-600 mt-1">
        {percent}% of {total} total orders
      </p>
      <div className="mt-4 bg-red-100 text-red-600 px-3 py-1 rounded-full text-xs font-medium">
        High cancellation rate?
      </div>
    </div>
  );
};

export default CancelledOrdersStats;
