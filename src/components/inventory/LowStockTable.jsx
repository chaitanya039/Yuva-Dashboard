import React from 'react';
import { useSelector } from 'react-redux';
import { FaBox, FaEdit } from 'react-icons/fa';
import { IoWarning } from 'react-icons/io5';

const LowStockTable = ({ onUpdateStock }) => {
  const { lowStock, lowStockLoading } = useSelector(state => state.inventory);

  return (
    <div className="border rounded-lg shadow-sm">
      <div className="flex items-center justify-between px-4 py-2 border-b bg-yellow-50">
        <h2 className="font-semibold text-yellow-800 flex items-center gap-2 text-sm md:text-base">
          <IoWarning className="text-lg" /> Low Stock Products
        </h2>
        <span className="text-sm text-yellow-700 font-medium">
          {lowStock?.length || 0} item{lowStock?.length !== 1 ? 's' : ''} under 10 units
        </span>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100 text-gray-600 text-left">
            <tr>
              <th className="p-3">Product</th>
              <th className="p-3">SKU</th>
              <th className="p-3">Category</th>
              <th className="p-3 text-right">Stock</th>
              <th className="p-3">Unit</th>
              <th className="p-3 text-center">Action</th>
            </tr>
          </thead>
          <tbody>
            {lowStockLoading ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  Loading...
                </td>
              </tr>
            ) : lowStock.length === 0 ? (
              <tr>
                <td colSpan="6" className="p-4 text-center text-gray-500">
                  All products are well stocked 🎉
                </td>
              </tr>
            ) : (
              lowStock.map((item, i) => (
                <tr key={i} className="border-t">
                  <td className="p-3 flex items-center gap-2">
                    {item.image ? (
                      <img
                        src={item.image}
                        alt={item.name}
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    ) : (
                      <FaBox className="text-gray-400" />
                    )}
                    <span className="font-medium text-gray-800">{item.name}</span>
                  </td>
                  <td className="p-3">{item.sku || '—'}</td>
                  <td className="p-3">{item.category?.name || '—'}</td>
                  <td className="p-3 text-right font-semibold text-yellow-800">
                    {item.stock}
                  </td>
                  <td className="p-3">{item.unit}</td>
                  <td className="p-3 text-center">
                    <button
                      onClick={() => onUpdateStock?.(item)}
                      className="inline-flex cursor-pointer items-center gap-1 text-xs px-3 py-1 border rounded text-blue-600 border-blue-600 hover:text-white hover:bg-blue-600"
                    >
                      <FaEdit className="text-sm" />
                      Update
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default LowStockTable;
