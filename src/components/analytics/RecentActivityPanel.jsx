import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchRecentActivity } from "../../features/analyticsSlice";

const IconWrapper = ({ children, color }) => (
  <div
    className={`w-10 h-10 rounded-full flex items-center justify-center text-white ${color} shadow-md`}
  >
    {children}
  </div>
);

const ActivityCard = ({ icon, title, data, renderItem }) => {
  return (
    <div className="bg-white shadow-lg hover:shadow-xl transition-all duration-300 rounded-2xl p-6 border border-gray-100">
      <div className="flex items-center gap-4 mb-4">
        <IconWrapper color={icon.color}>{icon.element}</IconWrapper>
        <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      </div>
      <div className="space-y-4">
        {data?.length > 0
          ? data.slice(0, 5).map((item, idx) => (
              <div key={item._id || idx} className="text-sm text-gray-700 border-l-4 border-gray-100 pl-3">
                {renderItem(item)}
              </div>
            ))
          : [...Array(3)].map((_, idx) => (
              <div
                key={idx}
                className="h-4 bg-gray-200 rounded w-3/4 animate-pulse"
              ></div>
            ))}
      </div>
    </div>
  );
};

const RecentActivityPanel = () => {
  const dispatch = useDispatch();
  const { recentActivity, loading, error } = useSelector(
    (state) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchRecentActivity());
  }, [dispatch]);

  if (loading)
    return (
      <div className="text-sm text-gray-500 p-4">Loading recent activity...</div>
    );
  if (error)
    return (
      <div className="text-sm text-red-500 p-4">Error: {error}</div>
    );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 bg-gray-50 p-6 rounded-xl">
      <ActivityCard
        icon={{ element: <span className="text-xl">🛒</span>, color: "bg-gradient-to-br from-blue-500 to-indigo-500" }}
        title="Recent Orders"
        data={recentActivity?.latestOrders}
        renderItem={(order) => (
          <div>
            <span className="font-semibold">#{order._id.slice(-6)}</span> &middot; ₹
            {order.totalAmount.toLocaleString("en-IN")} &middot;{" "}
            <span className="text-gray-600">{order.customer?.name}</span>
          </div>
        )}
      />

      <ActivityCard
        icon={{ element: <span className="text-xl">💸</span>, color: "bg-gradient-to-br from-pink-500 to-red-500" }}
        title="Recent Expenses"
        data={recentActivity?.latestExpenses}
        renderItem={(exp) => (
          <div>
            ₹{exp.amount} &middot;{" "}
            <span className="text-gray-600 capitalize">{exp.category}</span>
          </div>
        )}
      />

      <ActivityCard
        icon={{ element: <span className="text-xl">🧍‍♂️</span>, color: "bg-gradient-to-br from-green-500 to-teal-500" }}
        title="New Customers"
        data={recentActivity?.latestCustomers}
        renderItem={(cust) => (
          <div>
            <span className="font-semibold">{cust.name}</span> &middot;{" "}
            <span className="text-gray-600">{cust.type}</span>
          </div>
        )}
      />
    </div>
  );
};

export default RecentActivityPanel;

