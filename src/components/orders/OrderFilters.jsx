import React from "react";
import { FaPlus, FaTimes } from "react-icons/fa";

const OrderFilters = ({
  onSearch,
  onCreate,
  filters,
  onFilterChange,
  onReset,
}) => {
  return (
    <div className="bg-gray-50 border border-gray-200 rounded-lg p-4 mb-6 shadow-sm space-y-4">
      {/* Top Row: Search + Create */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:max-w-md">
          <input
            type="text"
            placeholder="Search orders by customer, email, etc."
            value={filters.search}
            onChange={(e) => onSearch(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500 "
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg
              className="h-5 w-5 text-gray-400"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
              stroke="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Create Order Button */}
        <div className="flex justify-end">
          <button
            onClick={onCreate}
            className="inline-flex items-center px-4 py-2  font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-md shadow"
          >
            <FaPlus className="mr-2" />
            Create New Order
          </button>
        </div>
      </div>

      {/* Filter Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {/* Customer Type */}
        <select
          value={filters.customerType}
          onChange={(e) =>
            onFilterChange({ customerType: e.target.value, page: 1 })
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2  shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Types</option>
          <option value="Retailer">Retailer</option>
          <option value="Wholesaler">Wholesaler</option>
        </select>

        {/* Status */}
        <select
          value={filters.status}
          onChange={(e) => onFilterChange({ status: e.target.value, page: 1 })}
          className="w-full border border-gray-300 rounded-md px-3 py-2  shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Statuses</option>
          <option value="Pending">Pending</option>
          <option value="Processing">Processing</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </select>

        {/* Payment Status */}
        <select
          value={filters.paymentStatus}
          onChange={(e) =>
            onFilterChange({ paymentStatus: e.target.value, page: 1 })
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2 shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="">All Payment Status</option>
          <option value="Unpaid">Unpaid</option>
          <option value="Partially Paid">Partially Paid</option>
          <option value="Paid">Paid</option>
        </select>

        {/* Sort Order */}
        <select
          value={filters.sortOrder}
          onChange={(e) =>
            onFilterChange({ sortOrder: e.target.value, page: 1 })
          }
          className="w-full border border-gray-300 rounded-md px-3 py-2  shadow-sm focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="desc">Newest First</option>
          <option value="asc">Oldest First</option>
        </select>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="inline-flex items-center  text-gray-600 hover:text-red-600"
        >
          <FaTimes className="mr-1" />
          Clear Filters
        </button>
      </div>
    </div>
  );
};

export default OrderFilters;
