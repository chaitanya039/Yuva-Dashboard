import React, { useEffect, useState } from "react";
import Modal from "react-modal";
import customModalStyles from "../../utils/CustomModalStyles";
import { FaSpinner, FaTrash } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { createOrder, fetchOrders, updateOrder } from "../../features/orderSlice";
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
  const [amountPaid, setAmountPaid] = useState(0);
  const [orderItems, setOrderItems] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState("");
  const { creating, updating } = useSelector((state) => state.orders); // Accessing creating and updating states from Redux store


  // Reset form data when modal is opened in Create mode
  useEffect(() => {
    if (isOpen && !isEdit) {
      setSelectedCustomer("");
      setNote("");
      setDiscount(0);
      setAmountPaid(0);
      setOrderItems([]);
      setSelectedProductId("");
    } else if (isOpen && isEdit && initialData) {
      setSelectedCustomer(initialData?.order?.customer?._id || "");
      setNote(initialData?.order?.specialInstructions || "");
      setDiscount(initialData?.order?.discount || 0);
      setAmountPaid(initialData?.order?.payment?.amountPaid || 0);
      setOrderItems(
        initialData.items?.map((item) => ({
          product: item.product._id,
          name: item.product.name,
          price: item.unitPrice,
          quantity: item.quantity,
          image: item.product.image,
        })) || []
      );
    }
  }, [isOpen, isEdit, initialData]);

  useEffect(() => {
    dispatch(fetchCustomers({ page: 1, limit: 100 }));
    dispatch(fetchProducts());
  }, [dispatch]);

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
        return { ...item, price };
      });
      setOrderItems(updatedItems);
    }
  }, [selectedCustomer, orderItems, customers, products]);

  const handleAddProduct = () => {
    const exists = orderItems.find(
      (item) => item.product === selectedProductId
    );
    if (exists) return toast.warn("Product already added");

    const product = products.find((p) => p._id === selectedProductId);
    const customer = customers.find((c) => c._id === selectedCustomer);
    if (!product || !customer) return;

    if (product.stock <= 0) return toast.warn("Product is out of stock");

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
    const originalQty =
      initialData?.items?.find((item) => item.product._id === productId)
        ?.quantity || 0;
    const maxAllowed = currentStock + (isEdit ? originalQty : 0);

    if (quantity > maxAllowed) {
      toast.warn(`Max available quantity: ${maxAllowed}`);
      updated[index].quantity = maxAllowed;
    } else {
      updated[index].quantity = quantity;
    }

    setOrderItems(updated);
  };

  const handleRemoveProduct = (index) => {
    setOrderItems((prev) => prev.filter((_, i) => i !== index));
  };

  const getSubtotal = () =>
    orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const netPayable = Math.max(getSubtotal() - discount, 0);

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
      amountPaid: Math.min(amountPaid, netPayable),
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

      // **Reset form fields after successful order creation/edit**
      setSelectedCustomer(""); 
      setNote("");
      setDiscount(0);
      setOrderItems([]);
      setSelectedProductId("");
      setAmountPaid(0);

      dispatch(fetchOrders());
      onClose(); // Close the modal
    }
  };

  const handleModalClose = () => {
    // Reset all form fields when modal closes
    setSelectedCustomer("");
    setNote("");
    setDiscount(0);
    setOrderItems([]);
    setSelectedProductId("");
    setAmountPaid(0);
    onClose(); // Close the modal after resetting
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={handleModalClose} // Close and reset form when closing modal
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

        {/* Payment Summary */}
        <div className="mb-6 border border-gray-600 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-4">3. Payment Details</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Subtotal
              </label>
              <div className="p-2 border border-gray-300 rounded-md bg-gray-100">
                ₹{getSubtotal()}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Discount
              </label>
              <input
                type="number"
                min="0"
                value={discount}
                onChange={(e) => setDiscount(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Amount Paid
              </label>
              <input
                type="number"
                min="0"
                value={amountPaid}
                onChange={(e) => setAmountPaid(parseFloat(e.target.value) || 0)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Net Payable
              </label>
              <div className="p-2 border border-gray-300 rounded-md bg-gray-100">
                ₹{netPayable}
              </div>
            </div>
          </div>
        </div>

        {/* Special Instructions */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700">
            Special Instructions
          </label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="flex justify-end gap-4">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-100"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-6 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700"
            disabled={creating || updating} // Disable button when creating or updating
          >
            {/* Show spinner and text when creating or updating */}
            {creating || updating ? (
              <>
                <div className="flex items-center justify-center gap-2">
                <FaSpinner className="animate-spin mr-2" />
                {isEdit ? "Updating Order..." : "Creating Order..."}
                </div>
              </>
            ) : isEdit ? (
              "Update Order"
            ) : (
              "Create Order"
            )}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default CreateOrderModal;
