import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import Modal from "react-modal";
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
  approveOrderRequest,
  rejectOrderRequest,
  setRequestFilters,
  resetRequestFilters,
} from "../features/orderRequestSlice";
import { toast } from "react-toastify";
import { exportInvoicePdf } from "../features/invoiceSlice";
import OrdersTabs from "../components/orders/OrdersTabs";
import OrderFilters from "../components/orders/OrderFilters";
import Pagination from "../components/orders/Pagination";
import OrdersTable from "../components/orders/OrdersTable";
import CreateOrderModal from "../components/modals/CreateOrderModal";
import ViewOrderModal from "../components/modals/ViewOrderModal";
import ConfirmDialog from "../components/ConfirmDialog";

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

const OrdersPage = () => {
  const dispatch = useDispatch();
  const { orders, totalOrders, currentOrder, filters, loading: loadingOrders } = useSelector(
    (state) => state.orders
  );
  const {
    requests: orderRequests,
    totalRequests,
    filters: requestFilters,
    loading: loadingRequests,
  } = useSelector((state) => state.orderRequests);

  const [activeTab, setActiveTab] = useState("All Orders");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [orderToDelete, setOrderToDelete] = useState(null);
  const [isDeletingNow, setIsDeletingNow] = useState(false);
  const [decisionNote, setDecisionNote] = useState("");

  const isOrders = activeTab === "All Orders";
  const activeFilters = isOrders ? filters : requestFilters;

  useEffect(() => {
    if (isOrders) {
      dispatch(fetchOrders(filters));
      dispatch(fetchRecentOrders());
    } else {
      dispatch(fetchOrderRequests(requestFilters));
    }
  }, [dispatch, filters, requestFilters, activeTab]);

  const handleTabChange = (tab) => {
    setActiveTab(tab);
    dispatch(
      tab === "All Orders" ? resetOrderFilters() : resetRequestFilters()
    );
  };

  const handleSearch = (query) => {
    const payload = { search: query, page: 1 };
    dispatch(isOrders ? setOrderFilters(payload) : setRequestFilters(payload));
  };

  const handleFilterChange = (newFilters) => {
    dispatch(
      isOrders ? setOrderFilters(newFilters) : setRequestFilters(newFilters)
    );
  };

  const handlePageChange = (page) => {
    dispatch(
      isOrders ? setOrderFilters({ page }) : setRequestFilters({ page })
    );
  };

  const handleEditOrder = async (id) => {
    const res = await dispatch(fetchOrderById(id));
    if (res.meta.requestStatus === "fulfilled") {
      setIsEditMode(true);
      setIsCreateModalOpen(true);
    }
  };

  const confirmDelete = async () => {
    if (!orderToDelete) return;
    setIsDeletingNow(true);
    const res = await dispatch(deleteOrder(orderToDelete));
    setIsDeletingNow(false);
    setShowConfirm(false);
    setOrderToDelete(null);
    res.meta.requestStatus === "fulfilled"
      ? toast.success("Order deleted")
      : toast.error("Failed to delete order");
  };

  const handlePrintOrder = async (order) => {
    const res = await dispatch(exportInvoicePdf(order._id));
    res.meta.requestStatus === "fulfilled"
      ? toast.success("Invoice downloaded")
      : toast.error("Failed to generate invoice");
  };

  const handleApprove = async (id) => {
    const res = await dispatch(approveOrderRequest({ id, decisionNote }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Order request approved successfully");
      setSelectedRequest(null);
      dispatch(fetchOrderRequests(requestFilters));
    } else {
      toast.error(res.payload || "Failed to approve order request");
    }
  };
  
  const handleReject = async (id) => {
    const res = await dispatch(rejectOrderRequest({ id, decisionNote }));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Order request rejected successfully");
      setSelectedRequest(null);
      setDecisionNote("");
      dispatch(fetchOrderRequests(requestFilters));
    } else {
      toast.error(res.payload || "Failed to reject order request");
    }
  };
  

  const totalPages = Math.ceil(
    (isOrders ? totalOrders : totalRequests) / activeFilters.limit
  );

  return (
    <div className="min-h-screen bg-gray-100 px-4 py-6">
      <div className="mb-4">
        <h1 className="text-2xl font-bold text-gray-800">Orders</h1>
      </div>

      <OrdersTabs activeTab={activeTab} onTabChange={handleTabChange} />

      <OrderFilters
        filters={activeFilters}
        onSearch={handleSearch}
        onFilterChange={handleFilterChange}
        onReset={() =>
          handleFilterChange({ search: "", sort: "newest", page: 1 })
        }
        onCreate={() => setIsCreateModalOpen(true)}
        showStatusFilter={isOrders}
        showDateFilter={isOrders}
        showSortFilter={true}
      />

      {isOrders ? (
        <OrdersTable
          orders={orders}
          onView={(order) => {
            dispatch(fetchOrderById(order._id));
            setIsViewModalOpen(true);
          }}
          onStatusChange={(id, status) =>
            dispatch(updateOrder({ id, data: { status } }))
          }
          onEdit={(order) => handleEditOrder(order._id)}
          onDelete={(id) => {
            setOrderToDelete(id);
            setShowConfirm(true);
          }}
          onPrint={handlePrintOrder}
        />
      ) : (
        <div className="overflow-x-auto custom-scrollbar mt-6 bg-white rounded shadow">
          <table className="min-w-full divide-y divide-gray-200 text-sm">
            <thead className="bg-gray-50 text-left uppercase text-xs text-gray-500 ">
              <tr>
                <th className="px-6 py-3 font-semibold">Request ID</th>
                <th className="px-6 py-3 font-semibold">Customer</th>
                <th className="px-6 py-3 font-semibold">Date</th>
                <th className="px-6 py-3 font-semibold">Items</th>
                <th className="px-6 py-3 font-semibold">Status</th>
                <th className="px-6 py-3 font-semibold text-right">Action</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loadingRequests ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : orderRequests.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-6 text-gray-500">
                    No requests found
                  </td>
                </tr>
              ) : (
                orderRequests.map((req) => (
                  <tr key={req._id}>
                    <td className="px-6 py-4">{req._id}</td>
                    <td className="px-6 py-4 flex items-center gap-3">
                      <img
                        src={
                          req.customer?.profileImg ||
                          "https://placehold.co/32x32"
                        }
                        alt="Profile"
                        className="w-10 h-10 rounded-full"
                      />
                      <div>
                        <div>{req.customer?.name}</div>
                        <div className="text-xs text-gray-500">
                          {req.customer?.email}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {new Date(req.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4">
                      {(req.items || []).slice(0, 3).map((item, index) => (
                        <div
                          key={index}
                          className="text-xs text-gray-700 truncate"
                        >
                          {item?.product?.name}
                        </div>
                      ))}
                      {req.items?.length > 3 && (
                        <span className="text-xs text-gray-400 italic">
                          + more
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusBadgeColor(
                          req.status
                        )}`}
                      >
                        {req.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() => setSelectedRequest(req)}
                        className="text-blue-600 hover:underline"
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
        currentPage={activeFilters.page}
        totalPages={totalPages}
        onPageChange={handlePageChange}
        limit={activeFilters.limit}
        totalItems={isOrders ? totalOrders : totalRequests}
      />

      <CreateOrderModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        isEdit={isEditMode}
        initialData={currentOrder}
      />

      <ViewOrderModal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        order={currentOrder}
        onEdit={() => handleEditOrder(currentOrder?.order?._id)}
      />

      {selectedRequest && (
        <Modal
          isOpen={!!selectedRequest}
          onRequestClose={() => setSelectedRequest(null)}
          contentLabel="Review Order Request"
          className="w-full h-fit max-w-2xl bg-white rounded-xl shadow-lg p-6 mx-auto mt-5 outline-none animate__animated animate__fadeIn"
          overlayClassName="fixed inset-0 bg-black/40 flex justify-center pt-10 z-50"
          >
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-bold text-gray-800">
                Review Order Request
              </h2>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Request Info */}
            <div className="text-sm text-gray-700 space-y-1">
              <p>
                <strong>ID:</strong> {selectedRequest._id}
              </p>
              <p>
                <strong>Customer:</strong> {selectedRequest.customer?.name}
              </p>
              <p>
                <strong>Status:</strong>
                <span
                  className={`ml-2 px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadgeColor(
                    selectedRequest.status
                  )}`}
                >
                  {selectedRequest.status}
                </span>
              </p>
              {selectedRequest.customerNote && (
                <p>
                  <strong>Customer Note:</strong>
                  <span className="ml-1 text-gray-600 italic">
                    "{selectedRequest.customerNote}"
                  </span>
                </p>
              )}
            </div>

            {/* Items */}
            <div className="border-t pt-4">
              <h4 className="text-md font-semibold mb-2 text-gray-700">
                Products
              </h4>
              <div className="space-y-2 max-h-60 overflow-y-auto pr-1 custom-scrollbar">
                {(selectedRequest.items || []).map((item, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-4 p-2  rounded-md"
                  >
                    <img
                      src={item?.product?.image || "https://placehold.co/40"}
                      alt={item?.product?.name}
                      className="w-12 h-12 rounded-md object-cover"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium">
                        {item?.product?.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        Quantity: {item?.quantity}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Decision Note */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Decision Note{" "}
                <span className="text-xs text-gray-400">
                  (Optional for rejection)
                </span>
              </label>
              <textarea
                rows={3}
                value={decisionNote}
                onChange={(e) => setDecisionNote(e.target.value)}
                placeholder="e.g. Item not in stock, invalid order..."
                className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end gap-3 pt-4">
              <button
                onClick={() => handleApprove(selectedRequest._id)}
                className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md transition"
              >
                Approve
              </button>
              <button
                onClick={() => handleReject(selectedRequest._id)}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md transition"
              >
                Reject
              </button>
              <button
                onClick={() => setSelectedRequest(null)}
                className="text-gray-600 hover:text-black px-4 py-2 transition"
              >
                Cancel
              </button>
            </div>
          </div>
        </Modal>
      )}

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        loading={isDeletingNow}
        title="Delete this order?"
        message="This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default OrdersPage;
