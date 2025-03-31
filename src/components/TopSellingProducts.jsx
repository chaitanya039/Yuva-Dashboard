import React from 'react';
import { useDispatch } from 'react-redux';

const COLORS = [
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
  'from-purple-400 to-purple-600',
  'from-rose-400 to-rose-600',
  'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600',
];


const TopSellingProducts = ({ products = [] }) => {
  const maxSold = Math.max(...products.map((p) => p.sold || 0));


  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 flex flex-col justify-between h-full">
      <div>
        <div className="flex justify-between items-center mb-5">
          <h3 className="text-lg font-semibold text-gray-800">Top Selling Products</h3>
        </div>

        <div className="space-y-4 p-1">
          {products.map((p, i) => {
            const widthPercent = ((p.sold / maxSold) * 100).toFixed(2);
            const barColor = COLORS[i % COLORS.length];

            return (
              <div key={i} className="flex items-center gap-3 group relative mb-4">
                <img
                  src={p.image || `https://placehold.co/40x40?text=${i + 1}`}
                  alt={p.productName}
                  className="w-10 h-10 rounded-md object-cover"
                />
                <div className="flex-1">
                  <div className="text-sm font-semibold text-gray-800 mb-1">
                    {p.productName}
                  </div>
                  <div
                    className="relative bg-gray-100 rounded-full h-3"
                    title={`Sold: ${p.sold}, Revenue: ₹${p.revenue?.toLocaleString()}, Category: ${p.category || '—'}`}
                  >
                    <div
                      className={`bg-gradient-to-r ${barColor} h-2.5 rounded-full transition-all`}
                      style={{ width: `${widthPercent}%` }}
                    />
                  </div>
                </div>
                <div className="text-sm text-gray-700 font-medium w-16 text-right">
                  {p.sold} sold
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default TopSellingProducts;
