import React from 'react';
import { Link } from 'react-router-dom';
import { Tooltip } from 'react-tooltip';

const statusMap = {
  Pending: {
    text: 'Pending',
    icon: '⏳',
    className: 'bg-yellow-100 text-yellow-800',
    tooltip: 'Waiting for processing',
  },
  Processing: {
    text: 'Processing',
    icon: '🔄',
    className: 'bg-blue-100 text-blue-800',
    tooltip: 'Order is being processed',
  },
  Completed: {
    text: 'Completed',
    icon: '✅',
    className: 'bg-green-100 text-green-800',
    tooltip: 'Order completed successfully',
  },
  Cancelled: {
    text: 'Cancelled',
    icon: '⛔',
    className: 'bg-red-100 text-red-800',
    tooltip: 'Order was cancelled',
  },
};


export const RecentOrders = ({ orders }) => (
  <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
    <div className="flex justify-between items-center mb-4">
      <h3 className="text-lg font-medium text-gray-700">Recent Orders</h3>
      <Link to="/orders" className="text-sm text-blue-600 hover:text-blue-800">
        View all
      </Link>
    </div>

    <div className="space-y-4">
      {orders.map((order, idx) => {
        const date = new Date(order.date);
        const formattedDate = `${date.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        })} • ${date.toLocaleTimeString('en-US', {
          hour: '2-digit',
          minute: '2-digit',
        })}`;

        const statusInfo = statusMap[order.status] || {
          text: order.status,
          icon: '',
          className: 'bg-gray-100 text-gray-800',
          tooltip: '',
        };

        return (
          <div
            key={order.id}
            className="border-b border-gray-200 pb-4 last:border-none"
          >
            <div className="flex justify-between items-center">
              <div>
                <p className="font-medium text-gray-800">{order.orderId}</p>
                <p className="text-sm text-gray-600">{order.customerName}</p>
              </div>

              <div
                className={`min-w-[110px] flex items-center justify-center gap-1 px-3 py-1 text-xs font-medium rounded-full cursor-default ${statusInfo.className}`}
                data-tooltip-id={`tooltip-${idx}`}
                data-tooltip-content={statusInfo.tooltip}
              >
                <span>{statusInfo.icon}</span>
                <span>{statusInfo.text}</span>
              </div>
              <Tooltip id={`tooltip-${idx}`} place="top" effect="solid" />
            </div>

            <div className="flex justify-between mt-2 text-sm">
              <p className="text-gray-600">{formattedDate}</p>
              <p className="font-medium text-gray-800">₹{order.amount}</p>
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
