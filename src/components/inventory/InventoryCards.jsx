import React from 'react';
import { useSelector } from 'react-redux';
import { FaBoxes, FaExclamationTriangle, FaTimesCircle, FaWarehouse } from 'react-icons/fa';

const InventoryCards = () => {
  const { overview, overviewLoading } = useSelector(state => state.inventory);

  const stats = [
    {
      label: 'Total Products',
      value: overview?.totalProducts || 0,
      icon: <FaBoxes className="text-blue-600 text-xl" />,
      bg: 'bg-blue-50',
    },
    {
      label: 'Total Stock Units',
      value: overview?.totalStock || 0,
      icon: <FaWarehouse className="text-green-600 text-xl" />,
      bg: 'bg-green-50',
    },
    {
      label: 'Low Stock',
      value: overview?.lowStock || 0,
      icon: <FaExclamationTriangle className="text-yellow-600 text-xl" />,
      bg: 'bg-yellow-50',
    },
    {
      label: 'Out of Stock',
      value: overview?.outOfStock || 0,
      icon: <FaTimesCircle className="text-red-600 text-xl" />,
      bg: 'bg-red-50',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat, i) => (
        <div
          key={i}
          className={`flex items-center justify-between p-4 rounded-xl shadow-sm ${stat.bg}`}
        >
          <div>
            <p className="text-sm text-gray-500">{stat.label}</p>
            <h3 className="text-2xl font-bold text-gray-800">
              {overviewLoading ? '...' : stat.value}
            </h3>
          </div>
          {stat.icon}
        </div>
      ))}
    </div>
  );
};

export default InventoryCards;
