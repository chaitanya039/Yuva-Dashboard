import React from 'react';
import { useSelector } from 'react-redux';
import moment from 'moment';
import { FaPlusCircle, FaMinusCircle } from 'react-icons/fa';

const RecentStockUpdates = () => {
  const { recentUpdates, recentUpdatesLoading } = useSelector(state => state.inventory);

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <h2 className="font-semibold text-gray-700 mb-3 text-sm md:text-base">
      <span className='mr-2 -ml-1'>🕓</span>
           Recent Stock Updates
      </h2>

      {recentUpdatesLoading ? (
        <div className="text-center text-gray-400 py-10">Loading updates...</div>
      ) : recentUpdates.length === 0 ? (
        <div className="text-center text-gray-500 py-6">No stock updates found</div>
      ) : (
        <ul className="divide-y">
          {recentUpdates.map((log, i) => (
            <li key={i} className="py-3 flex justify-between items-start">
              <div className="flex items-start gap-3">
                <div className="mt-1">
                  {log.action === 'add' ? (
                    <FaPlusCircle className="text-green-600" />
                  ) : (
                    <FaMinusCircle className="text-red-600" />
                  )}
                </div>

                <div className="text-sm">
                  <p className="text-gray-800 font-medium">
                    {log.action === 'add' ? 'Added' : 'Reduced'} {log.quantity} units
                  </p>
                  <p className="text-gray-500">
                    {log.product?.name} ({log.product?.sku})
                  </p>
                  {log.remarks && (
                    <p className="text-xs text-gray-400 mt-1">“{log.remarks}”</p>
                  )}
                </div>
              </div>

              <div className="text-xs text-right text-gray-500">
                <div>{moment(log.createdAt).format('MMM D, h:mm A')}</div>
                <div className="text-gray-400">by {log.updatedBy?.name || '—'}</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default RecentStockUpdates;
