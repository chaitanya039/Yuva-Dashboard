import React, { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import {
  fetchInventoryOverview,
  fetchLowStockProducts,
  fetchRecentStockUpdates,
  fetchStockActivityChartData,
  fetchMostUpdatedProducts,
  fetchOrderSnapshot,
} from '../features/inventorySlice';

import InventoryCards from '../components/inventory/InventoryCards';
import StockActivityChart from '../components/inventory/StockActivityChart';
import MostUpdatedProducts from '../components/inventory/MostUpdatedProducts';
import LowStockTable from '../components/inventory/LowStockTable';
import RecentStockUpdates from '../components/inventory/RecentStockUpdates';
import OrderSnapshot from '../components/inventory/OrderSnapshot';
import UpdateStockModal from '../components/inventory/UpdateStockModal'; // ✅ New import

const InventoryDashboard = () => {
  const dispatch = useDispatch();
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    dispatch(fetchInventoryOverview());
    dispatch(fetchLowStockProducts());
    dispatch(fetchRecentStockUpdates());
    dispatch(fetchStockActivityChartData());
    dispatch(fetchMostUpdatedProducts());
    dispatch(fetchOrderSnapshot());
  }, [dispatch]);

  return (
    <div className="space-y-8 min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8" id="inventory">
      {/* Breadcrumb */}
      <div>
        <h1 className="text-2xl font-bold text-gray-800">Inventory</h1>
        <nav className="text-sm text-gray-600 mt-1" aria-label="Breadcrumb">
          <ol className="flex items-center space-x-1">
            <li>
              <a href="#dashboard" className="hover:text-blue-600">
                Dashboard
              </a>
            </li>
            <li className="flex items-center space-x-1">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                <path
                  fillRule="evenodd"
                  d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Inventory</span>
            </li>
          </ol>
        </nav>
      </div>

      {/* Summary Cards */}
      <InventoryCards />
      
      {/* Optional Order Snapshot */}
      <OrderSnapshot />

      {/* Chart + Leaderboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <StockActivityChart />
        <MostUpdatedProducts />
      </div>

      {/* Low Stock Table (Click to update stock) */}
      <LowStockTable onUpdateStock={product => setSelectedProduct(product)} />

      {/* Stock History Logs */}
      <RecentStockUpdates />


      {/* Modal */}
      <UpdateStockModal
        isOpen={!!selectedProduct}
        onClose={() => setSelectedProduct(null)}
        product={selectedProduct}
      />
    </div>
  );
};

export default InventoryDashboard;
