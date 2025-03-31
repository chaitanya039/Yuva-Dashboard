import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { useDispatch, useSelector } from 'react-redux';
import { updateProductStock } from '../../features/inventorySlice';
import { toast } from 'react-toastify';

Modal.setAppElement('#root');

const UpdateStockModal = ({ isOpen, onClose, product }) => {
  const dispatch = useDispatch();
  const { updating } = useSelector(state => state.inventory);

  const [action, setAction] = useState('add');
  const [quantity, setQuantity] = useState('');
  const [remarks, setRemarks] = useState('');

  useEffect(() => {
    if (isOpen) {
      setAction('add');
      setQuantity('');
      setRemarks('');
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!quantity || isNaN(quantity) || quantity <= 0) {
      toast.error('Please enter a valid quantity');
      return;
    }

    const res = await dispatch(updateProductStock({
      productId: product._id,
      action,
      quantity: Number(quantity),
      remarks
    }));

    if (res.meta.requestStatus === 'fulfilled') {
      onClose();
    }
  };

  if (!product) return null;

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      overlayClassName="fixed inset-0 bg-black/30 z-50"
      className="w-full max-w-md mx-auto mt-20 bg-white rounded-lg p-6 shadow-lg z-50"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Update Stock for <span className="text-blue-600">{product.name}</span>
      </h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Action Type */}
        <div className="flex gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="action"
              value="add"
              checked={action === 'add'}
              onChange={() => setAction('add')}
            />
            Add
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="action"
              value="reduce"
              checked={action === 'reduce'}
              onChange={() => setAction('reduce')}
            />
            Reduce
          </label>
        </div>

        {/* Quantity */}
        <div>
          <label className="text-sm block mb-1 text-gray-700">Quantity</label>
          <input
            type="number"
            min={1}
            className="w-full border rounded px-3 py-2 text-sm"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            placeholder="Enter quantity"
            required
          />
        </div>

        {/* Remarks */}
        <div>
          <label className="text-sm block mb-1 text-gray-700">Remarks (optional)</label>
          <textarea
            className="w-full border rounded px-3 py-2 text-sm"
            rows={2}
            value={remarks}
            onChange={(e) => setRemarks(e.target.value)}
            placeholder="e.g. New stock arrived"
          />
        </div>

        {/* Buttons */}
        <div className="flex justify-end gap-2 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border rounded text-sm text-gray-600 hover:bg-gray-100"
            disabled={updating}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 disabled:opacity-50"
            disabled={updating}
          >
            {updating ? 'Updating...' : 'Update Stock'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default UpdateStockModal;
