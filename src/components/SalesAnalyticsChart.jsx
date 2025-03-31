import React, { useEffect, useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, Tooltip,
  Legend, ResponsiveContainer, CartesianGrid
} from 'recharts';

const COLORS = {
  Wholesaler: '#3B82F6',
  Retailer: '#10B981',
};

const getCurrentYear = () => new Date().getFullYear();
const getCurrentMonth = () => new Date().getMonth() + 1;

export const SalesAnalyticsChart = ({ data, onFetch }) => {
  const [type, setType] = useState('monthly');
  const [year, setYear] = useState(getCurrentYear());
  const [month, setMonth] = useState(getCurrentMonth());

  const years = Array.from({ length: 5 }, (_, i) => getCurrentYear() - 4 + i);
  const months = [
    { name: 'Jan', value: 1 }, { name: 'Feb', value: 2 }, { name: 'Mar', value: 3 },
    { name: 'Apr', value: 4 }, { name: 'May', value: 5 }, { name: 'Jun', value: 6 },
    { name: 'Jul', value: 7 }, { name: 'Aug', value: 8 }, { name: 'Sep', value: 9 },
    { name: 'Oct', value: 10 }, { name: 'Nov', value: 11 }, { name: 'Dec', value: 12 }
  ];

  useEffect(() => {
    const params = type === 'daily'
      ? { type, year, month }
      : type === 'monthly'
        ? { type, year }
        : { type };
    onFetch(params);
  }, [type, year, month]);

  return (
    <div className="bg-white rounded-lg shadow p-6 border border-gray-200">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium text-gray-700">Sales Analytics</h3>
        <div className="flex space-x-2">
          {['daily', 'monthly', 'yearly'].map(t => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3 py-1 text-xs cursor-pointer rounded-full ${
                type === t ? 'bg-blue-500 text-white' : 'bg-gray-200 text-gray-700'
              }`}
            >
              {t.charAt(0).toUpperCase() + t.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-2 mb-4">
        {(type === 'monthly' || type === 'daily') && (
          <select className="text-sm border rounded px-2 py-1" value={year} onChange={(e) => setYear(+e.target.value)}>
            {years.map(y => <option key={y} value={y}>{y}</option>)}
          </select>
        )}
        {type === 'daily' && (
          <select className="text-sm border rounded px-2 py-1" value={month} onChange={(e) => setMonth(+e.target.value)}>
            {months.map(m => <option key={m.value} value={m.value}>{m.name}</option>)}
          </select>
        )}
      </div>

      {/* Double Bar Chart */}
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="label" />
            <YAxis />
            <Tooltip formatter={(val) => `₹${val.toLocaleString()}`} />
            <Legend />
            <Bar dataKey="Wholesaler" fill={COLORS.Wholesaler} />
            <Bar dataKey="Retailer" fill={COLORS.Retailer} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
