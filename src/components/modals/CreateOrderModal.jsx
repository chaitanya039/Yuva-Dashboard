import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import customModalStyles from "../../utils/CustomModalStyles";
import { FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import {
  createOrder,
  fetchOrders,
  updateOrder,
} from "../../features/orderSlice";
import { fetchCustomers } from "../../features/customerSlice";
import { toast } from "react-toastify";
import { fetchProducts } from "../../features/productSlice";

const CreateOrderModal = ({
  isOpen,
  onClose,
  isEdit = false,
  initialData = null,
}) => {
  const dispatch = useDispatch();
  const { customers } = useSelector((state) => state.customers);
  const { products } = useSelector((state) => state.products);

  const [selectedCustomer, setSelectedCustomer] = useState("");
  const [note, setNote] = useState("");
  const [discount, setDiscount] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");

  useEffect(() => {
    if (isOpen) {
      dispatch(fetchCustomers({ page: 1, limit: 100 }));
      dispatch(fetchProducts());

      if (isEdit && initialData) {
        setSelectedCustomer(initialData?.order?.customer?._id || "");
        setNote(initialData?.order?.specialInstructions || "");
        setDiscount(initialData?.order?.discount || 0);
        setOrderItems(
          initialData.items?.map((item) => ({
            product: item.product._id,
            name: item.product.name,
            price: item.unitPrice,
            quantity: item.quantity,
            image: item.product.image,
          })) || []
        );
      } else {
        setSelectedCustomer("");
        setNote("");
        setDiscount(0);
        setOrderItems([]);
      }
    }
  }, [isOpen, isEdit, initialData, dispatch]);

  useEffect(() => {
    const customer = customers.find((c) => c._id === selectedCustomer);
    if (customer && orderItems.length > 0) {
      const updatedItems = orderItems.map((item) => {
        const product = products.find((p) => p._id === item.product);
        if (!product) return item;
        const price =
          customer.type === "Wholesaler"
            ? product.priceWholesale
            : product.priceRetail;
        return {
          ...item,
          price,
        };
      });
      setOrderItems(updatedItems);
    }
  }, [selectedCustomer]);

  const handleAddProduct = () => {
    const existing = orderItems.find(
      (item) => item.product === selectedProductId
    );
    if (existing) return toast.warn("Product already added");

    const product = products.find((p) => p._id === selectedProductId);
    const customer = customers.find((c) => c._id === selectedCustomer);
    if (!product || !customer) return;

    if (product.stock <= 0) {
      return toast.warn("Product is out of stock");
    }

    const price =
      customer.type === "Wholesaler"
        ? product.priceWholesale
        : product.priceRetail;

    setOrderItems((prev) => [
      ...prev,
      {
        product: product._id,
        name: product.name,
        price,
        image: product.image,
        quantity: 1,
      },
    ]);
  };

  const handleQuantityChange = (index, value) => {
    const updated = [...orderItems];
    const productId = updated[index].product;
    const quantity = parseInt(value) || 1;

    const product = products.find((p) => p._id === productId);
    if (!product) return;

    const currentStock = product.stock;

    if (isEdit && initialData) {
      const originalQty =
        initialData.items?.find((item) => item.product._id === productId)
          ?.quantity || 0;

      const maxAllowed = currentStock + originalQty;

      if (quantity > maxAllowed) {
        toast.warn(
          `Max available quantity: ${maxAllowed} (includes previously ordered ${originalQty})`
        );
        updated[index].quantity = maxAllowed;
      } else {
        updated[index].quantity = quantity;
      }
    } else {
      if (quantity > currentStock) {
        toast.warn(`Only ${currentStock} units available`);
        updated[index].quantity = currentStock;
      } else {
        updated[index].quantity = quantity;
      }
    }

    setOrderItems(updated);
  };

  const handleRemoveProduct = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const getSubtotal = () =>
    orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const getTotal = () => Math.max(getSubtotal() - discount, 0);

  const handleSubmit = async () => {
    if (!selectedCustomer || orderItems.length === 0) {
      return toast.error(
        "Please select a customer and add at least one product."
      );
    }

    for (let item of orderItems) {
      const product = products.find((p) => p._id === item.product);
      if (!product) continue;

      let availableStock = product.stock;

      if (isEdit && initialData) {
        const originalQty =
          initialData.items?.find((prev) => prev.product._id === item.product)
            ?.quantity || 0;

        availableStock += originalQty;
      }

      if (item.quantity > availableStock) {
        return toast.error(
          `Insufficient stock for ${product.name}. Only ${availableStock} units available.`
        );
      }
    }

    const payload = {
      customerId: selectedCustomer,
      discount,
      items: orderItems.map((item) => ({
        product: item.product,
        quantity: item.quantity,
      })),
      specialInstructions: note,
    };

    const action =
      isEdit && initialData?.order?._id
        ? updateOrder({ id: initialData?.order?._id, data: payload })
        : createOrder(payload);

    const res = await dispatch(action);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success(isEdit ? "Order updated" : "Order created");
      setSelectedCustomer("");
      setNote("");
      setDiscount(0);
      setOrderItems([]);
      setSelectedProductId("");
      dispatch(fetchOrders());
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      style={customModalStyles}
      contentLabel={isEdit ? "Edit Order Modal" : "Create Order Modal"}
      contentElement={(props, children) => (
        <div {...props} className="custom-scrollbar fade-zoom-real">
          {children}
        </div>
      )}
    >
      <div className="p-6">
        <h2 className="text-2xl font-bold mb-2 text-gray-800">
          {isEdit ? "Edit Order" : "Create New Order"}
        </h2>
        <p className="text-sm text-gray-500 mb-6">
          Fill in the details below to {isEdit ? "update" : "create"} the order
        </p>

        {/* Select Customer */}
        <div className="mb-6 border border-gray-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">1. Select Customer</h3>
          <select
            className="w-full px-4 py-2 mb-2 border border-gray-300 rounded-md"
            value={selectedCustomer}
            onChange={(e) => setSelectedCustomer(e.target.value)}
            disabled={isEdit}
          >
            <option value="">-- Select Customer --</option>
            {customers?.map((c) => (
              <option key={c._id} value={c._id}>
                {c.name} ({c.email})
              </option>
            ))}
          </select>
        </div>

        {/* Add Products */}
        <div className="mb-6 border border-gray-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">2. Add Products</h3>
          <div className="flex items-center gap-4 mb-4">
            <select
              className="w-full border border-gray-300 rounded-md px-3 py-2"
              value={selectedProductId}
              onChange={(e) => setSelectedProductId(e.target.value)}
              disabled={!selectedCustomer}
            >
              <option value="">-- Select Product --</option>
              {products.map((p) => (
                <option key={p._id} value={p._id}>
                  {p.name} ({p.sku})
                </option>
              ))}
            </select>
            <button
              onClick={handleAddProduct}
              className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
            >
              Add
            </button>
          </div>
          {!selectedCustomer && (
            <p className="text-sm text-orange-500 mb-2 -mt-2 ps-1">
              Please select a customer before adding products.
            </p>
          )}
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm text-left text-gray-700">
              <thead className="bg-gray-100">
                <tr>
                  <th className="px-4 py-2">Product</th>
                  <th className="px-4 py-2">Unit Price</th>
                  <th className="px-4 py-2">Quantity</th>
                  <th className="px-4 py-2">Total</th>
                  <th className="px-4 py-2 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {orderItems.map((p, index) => (
                  <tr key={index} className="border-b border-gray-200">
                    <td className="px-4 py-3">{p.name}</td>
                    <td className="px-4 py-3">₹{p.price}</td>
                    <td className="px-4 py-3">
                      <input
                        type="number"
                        min="1"
                        value={p.quantity}
                        onChange={(e) =>
                          handleQuantityChange(index, e.target.value)
                        }
                        className="w-20 text-center border border-gray-300 rounded-md"
                      />
                    </td>
                    <td className="px-4 py-3">₹{p.price * p.quantity}</td>
                    <td className="px-4 py-3 text-center">
                      <button
                        onClick={() => handleRemoveProduct(index)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Discount & Notes */}
        <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Discount (₹)
            </label>
            <input
              type="number"
              min="0"
              value={discount}
              onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">
              Notes (optional)
            </label>
            <textarea
              rows="2"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="w-full border border-gray-300 rounded-md px-4 py-2"
            />
          </div>
        </div>

        {/* Total & Action */}
        <div className="flex justify-between items-center mt-6">
          <div className="text-lg font-bold text-gray-700">
            Total: ₹{getTotal().toLocaleString()}
          </div>
          <div className="space-x-3">
            <button
              onClick={onClose}
              className="bg-gray-200 text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="bg-blue-600 text-white px-5 py-2 rounded-md hover:bg-blue-700"
            >
              {isEdit ? "Update Order" : "Create Order"}
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default CreateOrderModal;
