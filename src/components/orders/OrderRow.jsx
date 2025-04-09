import React from "react";
import moment from "moment";
import { FaEye, FaEdit, FaTrash, FaPrint } from "react-icons/fa";

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

const OrderRow = ({ order, onView, onDelete, onEdit, onPrint }) => {
  const customerName = order.customer?.name || "N/A";
  const customerType = order.customer?.type || "—";
  const profileImg = order.customer?.profileImg || "";
  const initials = customerName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();

  const amountPaid = order?.payment?.amountPaid || 0;
  const netPayable = order?.netPayable || order?.totalAmount || 0;

  return (
    <tr className="hover:bg-gray-50 transition">
      {/* Order ID */}
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {order?.orderId}
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
        {moment(order?.createdAt).format("MMM DD, YYYY")}
      </td>

      {/* Total Column */}
      <td className="px-6 py-2 whitespace-nowrap text-sm text-left leading-tight">
        <div className="space-y-0.5 text-[13px]">
          <div className="text-gray-600 line-through">
            ₹{order?.totalAmount.toLocaleString()}
          </div>
          <div className="font-semibold text-gray-900">
            ₹{order?.netPayable.toLocaleString()}
          </div>
          {order?.discount > 0 && (
            <div className="text-[11px] text-red-500">
              -{((order?.discount / order?.totalAmount) * 100).toFixed(0)}%
            </div>
          )}
        </div>
      </td>

      {/* Paid / NetPayable + Status */}
      <td className="px-6 py-4 whitespace-nowrap text-sm min-w-[160px]">
        <div className="font-medium text-gray-900">
          ₹{amountPaid.toLocaleString()}{" "}
          <span className="text-gray-500">/</span> ₹
          {netPayable.toLocaleString()}
        </div>
        <div className="relative w-full h-1.5 mt-1 bg-gray-200 rounded-full overflow-hidden">
          <div
            className={`absolute top-0 left-0 h-full rounded-full ${
              order?.payment.status === "Paid"
                ? "bg-green-600"
                : order?.payment.status === "Partially Paid"
                ? "bg-yellow-500"
                : "bg-red-500"
            }`}
            style={{
              width: `${Math.min((amountPaid / netPayable) * 100, 100)}%`,
            }}
          />
        </div>
        <div className="mt-2 flex items-center justify-between text-xs">
          <span
            className={`inline-block font-medium ${
              order?.payment.status === "Paid"
                ? "text-green-700 border-green-600"
                : order?.payment.status === "Partially Paid"
                ? "text-yellow-700 border-yellow-500"
                : "text-red-700 border-red-500"
            }`}
          >
            {order?.payment.status || "Unpaid"}
          </span>
          <span className="text-gray-500 ml-2">
            {Math.round((amountPaid / netPayable) * 100)}%
          </span>
        </div>
      </td>

      {/* Status */}
      <td className="px-6 py-4 whitespace-nowrap text-sm">
        <span
          title={statusMap[order.status]?.tooltip}
          className={`inline-flex items-center gap-1 px-3 py-1 text-xs font-medium rounded-full ${
            statusMap[order.status]?.className || "bg-gray-100 text-gray-600"
          }`}
        >
          {statusMap[order.status]?.icon} {statusMap[order.status]?.text}
        </span>
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
            onClick={() => onPrint(order)} // ✅ New Print button
            title="Print Invoice"
            className="cursor-pointer flex items-center justify-center w-9 h-9 text-indigo-600 border border-indigo-400 hover:bg-indigo-100 rounded-full transition duration-200"
          >
            <FaPrint className="w-4 h-4" />
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
