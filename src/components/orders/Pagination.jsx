// components/orders/Pagination.jsx
import React from 'react';

const Pagination = ({ currentPage, totalPages, onPageChange, limit, totalItems }) => {
  const pageNumbers = [];
  for (let i = 1; i <= totalPages; i++) {
    pageNumbers.push(i);
  }

  const start = (currentPage - 1) * limit + 1;
  const end = Math.min(currentPage * limit, totalItems);

  return (
    <div className="flex items-center justify-between mt-6">
      <p className="text-sm text-gray-700">
        Showing <span className="font-medium">{start}</span> to{' '}
        <span className="font-medium">{end}</span> of{' '}
        <span className="font-medium">{totalItems}</span> orders
      </p>

      <div className="flex items-center space-x-2">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Previous
        </button>

        {pageNumbers.map((number) => (
          <button
            key={number}
            onClick={() => onPageChange(number)}
            className={`px-3 py-1 rounded-md text-sm ${
              currentPage === number
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {number}
          </button>
        ))}

        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-3 py-1 rounded-md border border-gray-300 text-sm text-gray-700 hover:bg-gray-50 disabled:opacity-50"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default Pagination;
