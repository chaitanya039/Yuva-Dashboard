// KPI Card Component
import React from 'react';

export const KPI = ({ title, value, percent, color, label }) => {
  const isPositive = percent >= 0;
  const percentColor = isPositive ? 'text-green-600' : 'text-red-600';
  const barColor = {
    blue: 'bg-blue-500',
    green: 'bg-green-500',
    yellow: 'bg-yellow-500',
    red: 'bg-red-500',
  }[color];

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-base font-medium text-gray-700">{title}</h3>
        <span className={`bg-${color}-100 text-${color}-800 text-xs px-2 py-1 rounded-full`}>{label}</span>
      </div>
      <div className="flex items-baseline">
        <p className="text-2xl font-semibold text-gray-800">{value}</p>
        <p className={`ml-2 text-sm ${percentColor} flex items-center`}>
          {isPositive ? '+' : '-'}{Math.abs(percent)}%
        </p>
      </div>
      <div className="mt-3 h-2 bg-gray-200 rounded-full">
        <div className={`h-full ${barColor} rounded-full`} style={{ width: `${Math.min(100, Math.abs(percent))}%` }}></div>
      </div>
    </div>
  );
};