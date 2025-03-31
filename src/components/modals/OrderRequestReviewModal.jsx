import React, { useState } from "react";
import Modal from "react-modal";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import customModalStyles from "../../utils/CustomModalStyles";
import {
  FaArrowLeft,
  FaExclamationTriangle,
  FaCheck,
  FaTimes,
} from "react-icons/fa";
import {
  approveOrderRequest,
  rejectOrderRequest,
  fetchOrderRequests,
} from "../../features/orderRequestSlice";

const OrderRequestReviewModal = ({ isOpen, onClose, order }) => {
  const [decisionNote, setDecisionNote] = useState("");
  const dispatch = useDispatch();
  const { filters, approving, rejecting } = useSelector((state) => state.orderRequests);

  if (!order) return null;

  const getTotal = () =>
    order.items.reduce((sum, item) => sum + item.product?.priceRetail * item.quantity, 0);

  const handleApprove = async () => {
    await dispatch(approveOrderRequest(order._id));
    dispatch(fetchOrderRequests(filters));
    onClose();
  };

  const handleReject = async () => {
    await dispatch(rejectOrderRequest(order._id));
    dispatch(fetchOrderRequests(filters));
    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel="Order Request Review"
      contentElement={(props, children) => (
        <div {...props} className="custom-scrollbar fade-zoom-real">
          {children}
        </div>
      )}
    >
      <div className="p-6 bg-white min-h-screen">
        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center mb-4">
            <button onClick={onClose} className="text-blue-600 hover:text-blue-800 mr-2">
              <FaArrowLeft />
            </button>
            <h1 className="text-2xl font-semibold text-gray-800">
              Order Request {order._id.slice(-6).toUpperCase()}
            </h1>
          </div>
          <div className="flex items-center">
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
              {order.status}
            </span>
            <span className="text-sm text-gray-500 ml-2">
              Submitted on {moment(order.createdAt).format("MMM DD, YYYY")}
            </span>
          </div>
        </div>

        {/* Customer Info + Products */}
        <div className="bg-white rounded-lg border border-gray-200 mb-6">
          {/* Customer Info */}
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Customer Information</h2>
            <div className="flex items-start md:items-center">
              <div className="h-12 w-12 bg-gray-200 rounded-full flex items-center justify-center text-gray-700 text-lg font-medium">
                {order.customer?.name?.split(" ").map(n => n[0]).join("")}
              </div>
              <div className="ml-4">
                <div className="text-lg font-medium text-gray-900">{order.customer?.name}</div>
                <div className="text-sm text-gray-500">{order.customer?.email}</div>
                <div className="text-sm text-gray-500 mt-1">
                  Phone: {order.customer?.phone || "N/A"}
                </div>
              </div>
            </div>
          </div>

          {/* Requested Products */}
          <div className="p-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Requested Products</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Product
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unit Price
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Quantity
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Total
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {order.items.map((item, i) => (
                    <tr key={i}>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-10 w-10 bg-gray-100 rounded-md flex items-center justify-center text-gray-500">
                            {item.product?.name?.charAt(0)}
                          </div>
                          <div className="ml-4">
                            <div className="text-sm font-medium text-gray-900">
                              {item.product?.name || "Unnamed Product"}
                            </div>
                            <div className="text-xs text-gray-500">
                              SKU: {item.product?.sku || "—"}
                            </div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">
                        ₹{item.product?.priceRetail?.toLocaleString() || "0"}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-500">{item.quantity}</td>
                      <td className="px-6 py-4 text-sm font-semibold text-gray-900">
                        ₹{(item.product?.priceRetail * item.quantity).toLocaleString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex justify-end">
              <div className="text-right">
                <p className="text-sm text-gray-500 mb-1">Order Total</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{getTotal().toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Alert Box */}
        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
          <div className="flex">
            <FaExclamationTriangle className="text-yellow-400 mt-0.5" />
            <p className="ml-3 text-sm text-yellow-700">
              This is a customer-submitted order request awaiting your approval.
              Please review the details before proceeding.
            </p>
          </div>
        </div>

        {/* Notes (optional if added in schema) */}
        {order.customerNote && (
          <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
            <h2 className="text-lg font-medium text-gray-800 mb-4">Customer Notes</h2>
            <p className="text-sm text-gray-600">{order.customerNote}</p>
          </div>
        )}

        {/* Admin Decision */}
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-medium text-gray-800 mb-4">Admin Decision</h2>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Decision Notes (Optional)
            </label>
            <textarea
              rows="3"
              value={decisionNote}
              onChange={(e) => setDecisionNote(e.target.value)}
              placeholder="Add any notes about your decision..."
              className="w-full border border-gray-300 rounded-md py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex flex-col sm:flex-row sm:justify-end gap-3">
            <button
              disabled={rejecting}
              onClick={handleReject}
              className="order-2 sm:order-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
            >
              <FaTimes className="inline mr-2" /> Reject Order
            </button>
            <button
              disabled={approving}
              onClick={handleApprove}
              className="order-1 sm:order-2 px-4 py-2 text-sm font-medium text-white bg-green-600 border border-transparent rounded-md hover:bg-green-700"
            >
              <FaCheck className="inline mr-2" /> Approve Order
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default OrderRequestReviewModal;
