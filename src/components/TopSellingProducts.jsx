import React, { useState } from 'react';
import api from '../api/axiosInstance';

const COLORS = [
  'from-indigo-400 to-indigo-600',
  'from-teal-400 to-teal-600',
  'from-purple-400 to-purple-600',
  'from-rose-400 to-rose-600',
  'from-orange-400 to-orange-600',
  'from-pink-400 to-pink-600',
];

// helper to download a Blob
const downloadBlob = (data, filename, type) => {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
};

const TopSellingProducts = ({ products = [] }) => {
  const [loading, setLoading] = useState(false);
  const maxSold = Math.max(...products.map((p) => p.sold || 0));

  const handleExport = async (format) => {
    setLoading(true);
    try {
      const res = await api.get(
        `/reports/top-selling-products?export=${format}`,
        { responseType: 'blob' }
      );
      if (format === 'excel') {
        downloadBlob(
          res.data,
          'top_selling_products.xlsx',
          'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
        );
      } else if (format === 'pdf') {
        downloadBlob(res.data, 'top_selling_products.pdf', 'application/pdf');
      }
    } catch (err) {
      console.error('Export error:', err);
      alert('Failed to export report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-5 border border-gray-100 flex flex-col h-full">
      {/* Header with title and export buttons */}
      <div className="flex justify-between items-center mb-5">
        <h3 className="text-lg font-semibold text-gray-800">
          Top Selling Products
        </h3>
        <div className="space-x-2">
          <button
            onClick={() => handleExport('excel')}
            disabled={loading}
            className="px-3 cursor-pointer hover:text-white hover:bg-black py-1 text-black border text-sm rounded-md disabled:opacity-50 transition"
          >
            {loading ? 'Exporting...' : 'Export Excel'}
          </button>
          <button
            onClick={() => handleExport('pdf')}
            disabled={loading}
            className="px-3 cursor-pointer hover:text-white hover:bg-black py-1  text-black border text-sm rounded-md disabled:opacity-50 transition"
          >
            {loading ? 'Exporting...' : 'Export PDF'}
          </button>
        </div>
      </div>

      {/* Product list */}
      <div className="space-y-4 overflow-y-auto">
        {products.map((p, i) => {
          const widthPercent = maxSold
            ? ((p.sold / maxSold) * 100).toFixed(2)
            : 0;
          const barColor = COLORS[i % COLORS.length];

          return (
            <div
              key={i}
              className="flex items-center gap-3 group relative mb-4"
            >
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
                  title={`Sold: ${p.sold}, Revenue: ₹${p.revenue?.toLocaleString()}, Category: ${p.category ||
                    '—'}`}
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
  );
};

export default TopSellingProducts;
