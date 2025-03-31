import React from 'react';
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer
} from 'recharts';

export const SalesByCategory = ({ data = [] }) => {
  const hasData = data.length > 0 && data.some(d => d.percent > 0);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Sales by Category</h3>
      </div>

      {/* Pie Chart */}
      <div className="w-full h-64">
        {hasData ? (
          <ResponsiveContainer>
            <PieChart>
              <Pie
                data={data}
                dataKey="percent"
                nameKey="label"
                cx="50%"
                cy="50%"
                outerRadius={80}
                label={({ name, percent }) => `${name}: ${percent.toFixed(0)}%`}
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || '#8884d8'} />
                ))}
              </Pie>
              <Tooltip formatter={(value, name) => [`${value}%`, name]} />
            </PieChart>
          </ResponsiveContainer>
        ) : (
          <p className="text-center text-gray-400 mt-12">No sales data available</p>
        )}
      </div>

      {/* Category Cards */}
      <div className="grid grid-cols-2 gap-4 mt-6">
        {data.map((cat, index) => (
          <div key={index} className="border border-gray-200 rounded-lg p-3">
            <div className="flex items-center">
              <span
                className="h-3 w-3 rounded-full mr-2"
                style={{ backgroundColor: cat.color || '#8884d8' }}
              ></span>
              <span className="text-sm text-gray-700">{cat.label}</span>
            </div>
            <p className="text-lg font-medium text-gray-800 mt-1">
              {cat.percent}%
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
