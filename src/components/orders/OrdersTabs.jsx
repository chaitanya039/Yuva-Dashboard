// components/orders/OrdersTabs.jsx
import React, { useState } from 'react';

const tabs = ['All Orders', 'Order Requests'];

const OrdersTabs = ({ onTabChange }) => {
  const [activeTab, setActiveTab] = useState('All Orders');

  const handleTabClick = (tab) => {
    setActiveTab(tab);
    onTabChange(tab);
  };

  return (
    <div className="border-b border-gray-200 mb-6">
      <nav className="flex space-x-4">
        {tabs.map((tab) => (
          <button
            key={tab}
            onClick={() => handleTabClick(tab)}
            className={`px-4 py-2 text-sm font-medium ${
              activeTab === tab
                ? 'text-gray-900 border-b-2 border-blue-500'
                : 'text-gray-500 hover:text-gray-700'
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
