import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchLowStockProducts } from "@/redux/features/analyticsSlice";

const LowStockProductsChart = () => {
  const dispatch = useDispatch();
  const { lowStockProducts, loading } = useSelector((state) => state.analytics);

  useEffect(() => {
    dispatch(fetchLowStockProducts());
  }, [dispatch]);

  if (loading || !lowStockProducts) return <div>Loading...</div>;

  return (
    <div className="bg-white p-4 rounded-xl shadow w-full max-w-2xl overflow-auto">
      <h2 className="text-lg font-semibold mb-4">Low Stock Products (Stock &lt; 10)</h2>
      {lowStockProducts.length === 0 ? (
        <p className="text-gray-600">No products are low in stock.</p>
      ) : (
        <table className="w-full text-sm text-left">
          <thead className="bg-gray-100 text-gray-700">
            <tr>
              <th className="py-2 px-4">Product</th>
              <th className="py-2 px-4">Stock</th>
            </tr>
          </thead>
          <tbody>
            {lowStockProducts.map((product) => (
              <tr key={product._id} className="border-b">
                <td className="py-2 px-4">{product.name}</td>
                <td className="py-2 px-4">{product.stock}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default LowStockProductsChart;
