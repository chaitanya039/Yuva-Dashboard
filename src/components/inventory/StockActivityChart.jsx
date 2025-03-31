import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
  AreaChart,
  Area,
  BarChart,
  Bar,
  Legend
} from 'recharts';

const StockActivityChart = () => {
  const { chartData, chartLoading } = useSelector(state => state.inventory);
  const [chartType, setChartType] = useState('area');

  const renderChart = () => {
    switch (chartType) {
      case 'line':
        return (
          <LineChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="added" stroke="#4ade80" name="Added" />
            <Line type="monotone" dataKey="reduced" stroke="#f87171" name="Reduced" />
          </LineChart>
        );
      case 'bar':
        return (
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="date" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="added" fill="#4ade80" name="Added" />
            <Bar dataKey="reduced" fill="#f87171" name="Reduced" />
          </BarChart>
        );
      case 'area':
      default:
        return (
          <AreaChart data={chartData} margin={{ top: 10, right: 20, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="colorAdd" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#4ade80" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#4ade80" stopOpacity={0} />
              </linearGradient>
              <linearGradient id="colorReduce" x1="0" y1="0" x2="0" y2="1">
                <stop offset="10%" stopColor="#f87171" stopOpacity={0.5} />
                <stop offset="95%" stopColor="#f87171" stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis dataKey="date" />
            <YAxis />
            <CartesianGrid strokeDasharray="3 3" />
            <Tooltip />
            <Legend />
            <Area
              type="monotone"
              dataKey="added"
              stroke="#4ade80"
              fillOpacity={1}
              fill="url(#colorAdd)"
              name="Added"
            />
            <Area
              type="monotone"
              dataKey="reduced"
              stroke="#f87171"
              fillOpacity={1}
              fill="url(#colorReduce)"
              name="Reduced"
            />
          </AreaChart>
        );
    }
  };

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex justify-between items-center mb-3">
        <h2 className="font-semibold text-gray-700 text-sm md:text-base">
          Stock Movement Analytics (Last 7 Days)
        </h2>
        <select
          value={chartType}
          onChange={(e) => setChartType(e.target.value)}
          className="border px-2 py-1 rounded text-sm text-gray-700 bg-gray-50"
        >
          <option value="area">Area</option>
          <option value="line">Line</option>
          <option value="bar">Bar</option>
        </select>
      </div>

      {chartLoading ? (
        <div className="text-center text-gray-400 py-10">Loading chart...</div>
      ) : chartData.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No activity in the last 7 days</div>
      ) : (
        <ResponsiveContainer width="100%" height={280}>
          {renderChart()}
        </ResponsiveContainer>
      )}
    </div>
  );
};

export default StockActivityChart;
