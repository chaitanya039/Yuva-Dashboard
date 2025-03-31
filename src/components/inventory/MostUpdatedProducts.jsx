import React from 'react';
import { useSelector } from 'react-redux';

const MostUpdatedProducts = () => {
  const { mostUpdated, mostUpdatedLoading } = useSelector(state => state.inventory);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="font-semibold text-gray-700 mb-3 text-sm md:text-base flex items-center gap-2">
        Most Updated Products
      </h2>

      {mostUpdatedLoading ? (
        <div className="text-center text-gray-400 py-10">Loading leaderboard...</div>
      ) : mostUpdated.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No product updates found</div>
      ) : (
        <ul className="space-y-2 text-sm">
          {mostUpdated.map((item, i) => (
            <li
              key={i}
              className="flex items-center justify-between p-2 bg-gray-50 rounded hover:bg-gray-100 transition"
            >
              <div>
                <p className="font-medium text-gray-800">{item.name}</p>
                <p className="text-xs text-gray-500">SKU: {item.sku || '—'}</p>
              </div>
              <span className="text-sm font-semibold text-blue-600">
                {item.changes} update{item.changes > 1 ? 's' : ''}
              </span>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MostUpdatedProducts;
