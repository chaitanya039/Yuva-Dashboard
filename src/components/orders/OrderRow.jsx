import React from "react";
import moment from "moment";
import { FaEye, FaEdit, FaTrash } from "react-icons/fa";

const statusMap = {
  Pending: {
    text: "Pending",
    icon: "⏳",
    className: "bg-yellow-100 text-yellow-800",
    tooltip: "Waiting for processing",
  },
  Processing: {
    text: "Processing",
    icon: "🔄",
    className: "bg-blue-100 text-blue-800",
    tooltip: "Order is being processed",
  },
  Completed: {
    text: "Completed",
    icon: "✅",
    className: "bg-green-100 text-green-800",
    tooltip: "Order completed successfully",
  },
  Cancelled: {
    text: "Cancelled",
    icon: "⛔",
    className: "bg-red-100 text-red-800",
    tooltip: "Order was cancelled",
  },
};

const OrderRow = ({ order, onView, onStatusChange, onDelete, onEdit }) => {
  const customerName = order.customer?.name || "N/A";
  const customerType = order.customer?.type || "—";
  const profileImg = order.customer?.profileImg || "";
  const initials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  return (
    <tr className="hover:bg-gray-50 transition">
      {/* Order ID */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {order.orderId}
      </td>

      {/* Customer Info */}
      <td className="px-6 py-4 whitespace-nowrap">
        <div className="flex items-center">
          <div className="h-10 w-10 rounded-full overflow-hidden bg-gray-200 flex items-center justify-center text-sm font-medium text-gray-700">
            {profileImg ? (
              <img
                src={profileImg}
                alt="Profile"
                className="h-full w-full object-cover"
              />
            ) : (
              <span>{initials}</span>
            )}
          </div>
          <div className="ml-4">
            <div className="text-[15px] font-medium text-gray-900">
              {customerName}
            </div>
            <div className="text-sm text-gray-500">{customerType}</div>
          </div>
        </div>
      </td>

      {/* Date */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {moment(order.createdAt).format("MMM DD, YYYY")}
      </td>

      {/* Total Amount */}
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 font-medium">
        ₹{order?.totalAmount?.toLocaleString()}
      </td>

      {/* Status Dropdown */}
      <td className="px-6 py-4 whitespace-nowrap">
        <select
          value={order?.status}
          onChange={(e) => onStatusChange(order._id, e.target.value)}
          className={`text-xs font-medium rounded-full px-3 py-1 border focus:outline-none
            ${statusMap[order?.status]?.className}`}
        >
          <option value="Pending">{statusMap["Pending"].icon} Pending</option>
          <option value="Processing">
            {statusMap["Processing"].icon} Processing
          </option>
          <option value="Completed">
            {statusMap["Completed"].icon} Completed
          </option>
          <option value="Cancelled">
            {statusMap["Cancelled"].icon} Cancelled
          </option>
        </select>
      </td>

      {/* Actions */}
      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex justify-end items-center gap-3">
          <button
            onClick={() => onView(order)}
            title="View Order"
            className="cursor-pointer flex items-center justify-center w-9 h-9 text-blue-600 border border-blue-400 hover:bg-blue-100 rounded-full transition duration-200"
          >
            <FaEye className="w-4 h-4" />
          </button>
          <button
            onClick={() => onEdit(order)}
            title="Edit Order"
            className="cursor-pointer flex items-center justify-center w-9 h-9 text-gray-600 border border-gray-400 hover:bg-gray-100 rounded-full transition duration-200"
          >
            <FaEdit className="w-4 h-4" />
          </button>
          <button
            onClick={() => onDelete(order._id)}
            title="Delete Order"
            className="cursor-pointer flex items-center justify-center w-9 h-9 text-red-600 border border-red-400 hover:bg-red-100 rounded-full transition duration-200"
          >
            <FaTrash className="w-4 h-4" />
          </button>
        </div>
      </td>
    </tr>
  );
};

export default OrderRow;
