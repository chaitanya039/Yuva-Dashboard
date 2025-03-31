import React from 'react';
import { useSelector } from 'react-redux';
import { FaCheckCircle, FaClock, FaRupeeSign, FaSync } from 'react-icons/fa';

const OrderSnapshot = () => {
  const { orderSnapshot, orderSnapshotLoading } = useSelector(state => state.inventory);

  const stats = [
    {
      icon: <FaClock className="text-white" />,
      label: 'Pending Orders',
      value: orderSnapshot?.pending || 0,
      bg: 'bg-yellow-500',
    },
    {
      icon: <FaSync className="text-white" />,
      label: 'Processing Orders',
      value: `${orderSnapshot?.processing}`,
      bg: 'bg-blue-500',
    },
    {
      icon: <FaCheckCircle className="text-white" />,
      label: 'Completed Orders',
      value: orderSnapshot?.completed || 0,
      bg: 'bg-green-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`p-4 flex justify-between rounded-lg items-center shadow-sm ${stat.bg}`}
        >
          <div>
            <p className="text-sm mb-1 text-white">{stat.label}</p>
            <h3 className="text-2xl font-bold text-white">
              {orderSnapshotLoading ? '...' : stat.value}
            </h3>
          </div>
          {stat.icon}
        </div>
      ))}
    </div>
  );
};

export default OrderSnapshot;
