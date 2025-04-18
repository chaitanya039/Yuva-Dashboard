// components/orders/OrdersTabs.jsx
import React from "react";

const tabs = ["All Orders", "Order Requests"];

const OrdersTabs = ({ activeTab, onTabChange }) => {
  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition duration-200 ${
              activeTab === tab
                ? "text-blue-600 border-b-2 border-blue-600 bg-white shadow"
                : "text-gray-500 hover:text-blue-600"
            }`}
          >
            {tab}
          </button>
        ))}
      </nav>
    </div>
  );
};

export default OrdersTabs;