import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchOrders,
  fetchOrderById,
  fetchRecentOrders,
  setOrderFilters,
  resetOrderFilters,
  deleteOrder,
  updateOrder,
} from "../features/orderSlice";

import {
  fetchOrderRequests,
  setRequestFilters,
  resetRequestFilters,
} from "../features/orderRequestSlice";

import OrdersTabs from "../components/Orders/OrdersTabs";
import OrderFilters from "../components/Orders/OrderFilters";
import OrderTable from "../components/Orders/OrdersTable";
import Pagination from "../components/Orders/Pagination";
import CreateOrderModal from "../components/Modals/CreateOrderModal";
import ViewOrderModal from "../components/Modals/ViewOrderModal";
import OrderRequestReviewModal from "../components/modals/OrderRequestReviewModal";
import { toast } from "react-toastify";
import ConfirmDialog from "../components/ConfirmDialog";

const OrdersPage = () => {
  const dispatch = useDispatch();

  // Orders
  const { orders, totalOrders, currentOrder, filters } = useSelector(
    (state) => state.orders
  );

  // Order Requests
  const {
    requests: orderRequests,
    totalRequests,
    filters: requestFilters,
    loading: loadingRequests,
  } = useSelector((state) => state.orderRequests);

  // UI State
  const [activeTab, setActiveTab] = useState("All Orders");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeletingNow, setIsDeletingNow] = useState(false);

  useEffect(() => {
    if (activeTab === "All Orders") {
      dispatch(fetchOrders(filters));
      dispatch(fetchRecentOrders());
    } else {
      dispatch(fetchOrderRequests(requestFilters));
    }
  }, [dispatch, filters, requestFilters, activeTab]);

  const handleEditOrder = async (orderId) => {
    const res = await dispatch(fetchOrderById(orderId));
    if (res.meta.requestStatus === "fulfilled") {
      setIsEditMode(true);
      setIsCreateModalOpen(true);
    }
  };

  const handleDeleteConfirm = (orderId) => {
    setOrderToDelete(orderId);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;

    setIsDeletingNow(true);
    const res = await dispatch(deleteOrder(orderToDelete));
    setIsDeletingNow(false);
    setShowConfirm(false);
    setOrderToDelete(null);

    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Order deleted successfully");
      dispatch(fetchOrders(filters));
    } else {
      toast.error(res.payload || "Failed to delete order");
    }
  };

  const handleSearch = (query) => {
    if (activeTab === "All Orders") {
      dispatch(setOrderFilters({ search: query, page: 1 }));
    } else {
      dispatch(setRequestFilters({ search: query, page: 1 }));
    }
  };

  const handleFilterChange = (newFilters) => {
    if (activeTab === "All Orders") {
      dispatch(setOrderFilters({ ...newFilters }));
    } else {
      dispatch(setRequestFilters({ ...newFilters }));
    }
  };

  const handleResetFilters = () => {
    if (activeTab === "All Orders") {
      dispatch(resetOrderFilters());
    } else {
      dispatch(resetRequestFilters());
    }
  };

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    if (tab === "All Orders") {
      dispatch(resetOrderFilters());
    } else {
      dispatch(resetRequestFilters());
    }
  };

  const handlePageChange = (page) => {
    if (page >= 1) {
      if (activeTab === "All Orders") {
        dispatch(setOrderFilters({ page }));
      } else {
        dispatch(setRequestFilters({ page }));
      }
    }
  };

  const handleCreateOrder = () => {
    setIsCreateModalOpen(true);
  };

  const handleViewOrder = async (orderId) => {
    const res = await dispatch(fetchOrderById(orderId));
    if (res.meta.requestStatus === "fulfilled") {
      setIsViewModalOpen(true);
    }
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedRequest(null);
    setIsEditMode(false);
  };

  const handleStatusChange = async (orderId, newStatus) => {
    try {
      await dispatch(updateOrder({ id: orderId, data: { status: newStatus } }));
      await dispatch(fetchOrders());
    } catch (err) {
      console.error("Status update failed:", err);
    }
  };

  const getStatusBadgeColor = (status) => {
    switch (status) {
      case "Pending":
        return "bg-yellow-100 text-yellow-800";
      case "Approved":
        return "bg-blue-100 text-blue-800";
      case "Rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const totalPages =
    activeTab === "All Orders"
      ? Math.ceil(totalOrders / filters.limit)
      : Math.ceil(totalRequests / requestFilters.limit);

  const activeFilters = activeTab === "All Orders" ? filters : requestFilters;

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8" id="orders">
      <div className="mb-3">
            <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
            <nav className="text-sm text-gray-600 mt-1" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1">
                <li>
                  <a href="#dashboard" className="hover:text-blue-600">
                    Dashboard
                  </a>
                </li>
                <li className="flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Orders</span>
                </li>
              </ol>
            </nav>
          </div>

      <OrdersTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <OrderFilters
        filters={activeFilters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onReset={handleResetFilters}
        onCreate={handleCreateOrder}
      />

      {activeTab === "All Orders" && (
        <OrderTable
          onView={(order) => handleViewOrder(order._id)}
          onStatusChange={handleStatusChange}
          orders={orders}
          onEdit={(order) => handleEditOrder(order._id)}
          onDelete={(orderId) => handleDeleteConfirm(orderId)}
        />
      )}

      {activeTab === "Order Requests" && (
        <div className="overflow-x-auto custom-scrollbar mt-6">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Request ID
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Customer
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Status
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Action
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingRequests ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : orderRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-6 text-gray-500">
                    No requests found
                  </td>
                </tr>
              ) : (
                orderRequests.map((request) => (
                  <tr key={request._id}>
                    <td className="px-6 py-4 text-sm text-gray-800">
                      {request._id}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-700">
                      {request.customer?.name || "N/A"}
                      <div className="text-xs text-gray-500">
                        {request.customer?.email || ""}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-500">
                      {new Date(request.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-sm font-semibold">
                      <span
                        className={`inline-block px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          request.status
                        )}`}
                      >
                        {request.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-right">
                      <button
                        onClick={() => setSelectedRequest(request)}
                        className="text-blue-600 hover:text-blue-800 font-medium"
                      >
                        Review
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      <Pagination
        currentPage={
          activeTab === "All Orders" ? filters.page : requestFilters.page
        }
        totalPages={totalPages}
        onPageChange={handlePageChange}
      />

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        isEdit={isEditMode}
        initialData={currentOrder}
      />

      <ViewOrderModal
        isOpen={isViewModalOpen}
        onClose={handleCloseModals}
        order={currentOrder}
        onEdit={() => handleEditOrder(currentOrder?.order?._id)}
        />
      <OrderRequestReviewModal
        isOpen={!!selectedRequest}
        onClose={() => setSelectedRequest(null)}
        order={selectedRequest}
      />

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        loading={isDeletingNow}
        title="Delete this order?"
        message="Are you sure you want to delete this order? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default OrdersPage;
