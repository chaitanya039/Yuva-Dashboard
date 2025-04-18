import React from "react";
import OrderRow from "./OrderRow";

const OrdersTable = ({ onView, onStatusChange, orders, onDelete, onEdit, onPrint }) => {
  return (
    <div className="overflow-x-auto bg-white shadow rounded-lg custom-scrollbar mt-6">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Order ID
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Customer
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Date
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Total
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Paid
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
              Status
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
              Actions
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {orders?.length === 0 ? (
            <tr>
              <td colSpan={7} className="text-center py-4 text-gray-500">
                No orders found
              </td>
            </tr>
          ) : (
            orders.map((order) => (
              <OrderRow
                key={order._id}
                order={order}
                onView={onView}
                onStatusChange={onStatusChange}
                onDelete={onDelete}
                onEdit={onEdit}
                onPrint={onPrint} // ✅ new prop
              />
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OrdersTable;
