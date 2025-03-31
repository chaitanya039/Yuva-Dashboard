import React, { useState } from "react";
import Modal from "react-modal";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import moment from "moment";

import {
  FaTrash,
  FaEdit,
  FaPrint,
  FaCheckCircle,
  FaClock,
  FaHourglassHalf,
} from "react-icons/fa";
import { BsDot } from "react-icons/bs";

import { deleteOrder, fetchOrders } from "../../features/orderSlice";
import customModalStyles from "../../utils/CustomModalStyles";
import { exportInvoicePdf } from "../../features/invoiceSlice";


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
    icon: "❌",
    className: "bg-red-100 text-red-800",
    tooltip: "Order was cancelled",
  },
};

const ViewOrderModal = ({ isOpen, onClose, order, onEdit }) => {
  const dispatch = useDispatch();
  const [deleting, setDeleting] = useState(false);

  if (!order) return null;

  const handlePrint = async () => {
    const res = await dispatch(exportInvoicePdf(order.order._id));
  
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Invoice downloaded successfully");
    } else {
      toast.error(res.payload || "Failed to generate invoice");
    }
  };
  

  const handleDelete = async () => {
    setDeleting(true);
    const res = await dispatch(deleteOrder(order.order._id));
    setDeleting(false);

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Order deleted successfully");
      dispatch(fetchOrders());
      onClose();
    } else {
      toast.error(res.payload || "Failed to delete order");
    }
  };

  const getTotal = () =>
    order.items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel="View Order"
      contentElement={(props, children) => (
        <div {...props} className="custom-scrollbar fade-zoom-real">
          {children}
        </div>
      )}
    >
      <div className="p-6">
        {/* Header */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-800">
            Order <span className="text-blue-600">{order.order.orderId}</span>
          </h2>
          <p className="text-sm mt-2 text-gray-500 flex items-center gap-2 flex-wrap">
            {statusMap[order.order.status] && (
              <span
                className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${
                  statusMap[order.order.status].className
                }`}
                title={statusMap[order.order.status].tooltip}
              >
                {statusMap[order.order.status].text}
              </span>
            )}
            <span>
              Created on {moment(order.createdAt).format("MMM DD, YYYY")}
            </span>
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left Column */}
          <div className="md:col-span-2 space-y-6">
            {/* Order Items */}
            <div className="border rounded-md">
              <div className="border-b px-4 py-2 font-semibold text-gray-700 bg-gray-50">
                Order Items
              </div>
              <div className="divide-y">
                {order.items.map((item, i) => (
                  <div
                    key={i}
                    className="p-4 flex justify-between items-center gap-4"
                  >
                    <div className="flex items-center gap-3">
                      {/* Image or SKU initials */}
                      {item.product?.image ? (
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="w-10 h-10 object-cover rounded-full"
                        />
                      ) : (
                        <div className="w-10 h-10 flex items-center justify-center rounded-full bg-gray-200 text-gray-700 font-medium text-sm">
                          {item.product?.sku
                            ? item.product.sku
                                .split("-")
                                .map((s) => s[0])
                                .join("")
                                .slice(0, 2)
                                .toUpperCase()
                            : "NA"}
                        </div>
                      )}

                      <div>
                        <div className="font-medium">
                          {item.product?.name || "Unnamed Product"}
                        </div>
                        <div className="text-xs text-gray-500">
                          SKU: {item.product?.sku || "—"}
                        </div>
                      </div>
                    </div>

                    <div className="text-right text-sm">
                      <div>₹{item.unitPrice.toLocaleString()}</div>
                      <div>x{item.quantity}</div>
                      <div className="font-semibold">
                        ₹{item.totalPrice.toLocaleString()}
                      </div>
                    </div>
                  </div>
                ))}
                <div className="p-4 text-right font-semibold bg-gray-50">
                  Total: ₹{getTotal().toLocaleString()}
                </div>
              </div>
            </div>

            {/* Order History */}
            <div className="border rounded-md">
              <div className="border-b px-4 py-2 font-semibold text-gray-700 bg-gray-50">
                Order History
              </div>
              <div className="px-4 py-3 space-y-3 text-sm text-gray-700">
                {order.order.statusHistory?.map((entry, i) => (
                  <div key={i} className="flex items-start gap-2">
                    {statusMap[entry.status] && (
                      <span
                        className={`text-lg mt-0.5`}
                        title={statusMap[entry.status].tooltip}
                      >
                        {statusMap[entry.status].icon}
                      </span>
                    )}
                    <div>
                      <div className="font-medium">{entry.status}</div>
                      <div className="text-xs text-gray-500">
                        {moment(entry.date).format("MMM DD, YYYY, h:mm A")}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Notes */}
            {order.order.specialInstructions && (
              <div className="border rounded-md">
                <div className="border-b px-4 py-2 font-semibold text-gray-700 bg-gray-50">
                  Notes
                </div>
                <div className="p-4 text-sm text-gray-800">
                  {order.order.specialInstructions}
                </div>
              </div>
            )}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {/* Customer Info */}
            <div className="border rounded-md">
              <div className="border-b px-4 py-2 font-semibold text-gray-700 bg-gray-50">
                Customer Information
              </div>
              <div className="p-4 text-sm flex items-center gap-4 flex-wrap">
                {order.order.customer?.profileImg ? (
                  <img
                    src={order.order.customer.profileImg}
                    alt="Customer"
                    className="w-14 h-14 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-14 h-14 rounded-full bg-gray-200 flex items-center justify-center text-xl font-semibold text-gray-700">
                    {order.order.customer?.name
                      ?.split(" ")
                      .map((n) => n[0])
                      .join("")
                      .toUpperCase()}
                  </div>
                )}

                <div>
                  <div className="font-semibold text-gray-900">
                    {order.order.customer?.name || "N/A"}
                  </div>
                  <div className="text-gray-500">
                    {order.order.customer?.company}
                  </div>
                  <div className="mt-1 text-gray-700">
                    {order.order.customer?.email}
                  </div>
                  <div className="text-gray-700">
                    {order.order.customer?.phone}
                  </div>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="border rounded-md">
              <div className="border-b px-4 py-2 font-semibold text-gray-700 bg-gray-50">
                Actions
              </div>
              <div className="p-4 space-y-3">
                <button
                  className="w-full cursor-pointer px-4 py-2 text-sm border rounded-md flex items-center gap-2 hover:bg-gray-100"
                  onClick={() => {
                    onEdit(order);
                    onClose();
                  }}
                >
                  <FaEdit className="text-gray-500" />
                  Edit Order
                </button>

                <button
                  className="w-full cursor-pointer px-4 py-2 text-sm border text-yellow-700 border-yellow-700 rounded-md flex items-center gap-2 hover:bg-yellow-50"
                  onClick={handlePrint}
                >
                  <FaPrint className="text-yellow-700" />
                  Print Invoice
                </button>

                <button
                  className="w-full cursor-pointer px-4 py-2 text-sm border border-red-500 text-red-600 rounded-md flex items-center justify-start gap-2 hover:bg-red-50 disabled:opacity-60"
                  onClick={handleDelete}
                  disabled={deleting}
                >
                  {deleting ? (
                    <>
                      <svg
                        className="w-4 h-4 animate-spin"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8v8H4z"
                        ></path>
                      </svg>
                      Deleting...
                    </>
                  ) : (
                    <>
                      <FaTrash />
                      Delete Order
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default ViewOrderModal;
