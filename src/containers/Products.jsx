import { useState, useEffect, useRef } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  setFilters,
  resetFilters,
} from "../features/productSlice";
import { toast } from "react-toastify";
import Modal from "react-modal";
import {
  FaEdit,
  FaTrash,
  FaPlus,
  FaSearch,
  FaFilter,
  FaSpinner,
} from "react-icons/fa";
import { fetchCategories } from "../features/categorySlice";
import ConfirmDialog from "../components/ConfirmDialog";
import UpdateStockModal from "../components/inventory/UpdateStockModal"; // ✅ import
import { MdInventory, MdInventory2, MdUpdate } from "react-icons/md";

Modal.setAppElement("#root");

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    marginRight: "-50%",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "600px",
    maxHeight: "95vh",
    overflowY: "auto",
    padding: "0",
    borderRadius: "0.5rem",
    border: "none",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    zIndex: 1000,
  },
};

const Products = () => {
  const dispatch = useDispatch();
  const {
    products,
    loading,
    error,
    creating,
    updating,
    deleting,
    filters,
    totalProducts,
    currentPage: reduxCurrentPage,
  } = useSelector((state) => state.products);
  const { categories } = useSelector((state) => state.categories);

  // State for loaders
  const isSubmitting = creating || updating;

  // Update stock

  const [stockModalOpen, setStockModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  // States for dialog
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [isDeletingNow, setIsDeletingNow] = useState(false);

  // Local state for form and modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentProduct, setCurrentProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    category: "",
    priceRetail: "",
    priceWholesale: "",
    stock: "",
    unit: "",
    gsm: "",
    image: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  // Constants
  const productsPerPage = 10;

  // Fetch products when filters or page change
  useEffect(() => {
    dispatch(
      fetchProducts({
        ...filters,
        page: reduxCurrentPage,
        limit: productsPerPage,
      })
    );
  }, [dispatch, filters, reduxCurrentPage]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  // Form handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file,
      });

      // Create preview
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setIsEditMode(false);
    setCurrentProduct(null);
    setFormData({
      name: "",
      description: "",
      category: "",
      priceRetail: "",
      priceWholesale: "",
      stock: "",
      unit: "",
      gsm: "",
      image: null,
    });
    setImagePreview("");
    setModalIsOpen(true);
  };

  const openEditModal = (product) => {
    setIsEditMode(true);
    setCurrentProduct(product);
    setFormData({
      name: product.name,
      description: product.description,
      category:
        typeof product.category === "object"
          ? product.category._id
          : product.category,
      priceRetail: product.priceRetail,
      priceWholesale: product.priceWholesale,
      stock: product.stock,
      unit: product.unit,
      gsm: product.gsm,
      image: null,
    });
    setImagePreview(product.image || "");
    setModalIsOpen(true);
  };

  const openStockModal = (product) => {
    setSelectedProduct(product);
    setStockModalOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("description", formData.description);
    data.append("category", formData.category);
    data.append("priceRetail", formData.priceRetail);
    data.append("priceWholesale", formData.priceWholesale);
    data.append("stock", formData.stock);
    data.append("unit", formData.unit);
    data.append("gsm", formData.gsm);
    if (formData.image) {
      data.append("image", formData.image);
    }

    try {
      if (isEditMode) {
        await dispatch(
          updateProduct({ id: currentProduct._id, formData: data })
        ).unwrap();
        toast.success("Product updated successfully");
      } else {
        await dispatch(createProduct(data)).unwrap();
        toast.success("Product created successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Form submission failed:", error);
      toast.error("Operation failed. Please try again.");
    }
  };

  // Product Deletion
  const handleDeleteConfirm = (id) => {
    setSelectedProductId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeletingNow(true);
    try {
      await dispatch(deleteProduct(selectedProductId)).unwrap();
      toast.success("Product deleted successfully");
      setShowConfirm(false);
    } catch (error) {
      console.error("Delete error:", error);
      toast.error("Operation failed. Please try again.");
    } finally {
      setIsDeletingNow(false);
    }
  };

  // Filter handlers
  const applyFilters = () => {
    dispatch(setFilters({ ...filters, page: 1 }));
  };

  const handleResetFilters = () => {
    dispatch(resetFilters());
  };

  // Pagination
  const handlePageChange = (page) => {
    dispatch(setFilters({ ...filters, page }));
  };

  // Stock status helpers
  const getStockStatus = (stock) => {
    if (stock >= 10) return "In Stock";
    if (stock > 0) return "Low Stock";
    return "Out of Stock";
  };

  const getStockStatusClass = (stock) => {
    if (stock >= 10) return "bg-green-100 text-green-800";
    if (stock > 0) return "bg-yellow-100 text-yellow-800";
    return "bg-red-100 text-red-800";
  };

  // Calculate pagination values
  const totalPages = Math.ceil(totalProducts / productsPerPage);
  const indexOfLastProduct = reduxCurrentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = products.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );

  const modalRef = useRef(null);

  useEffect(() => {
    if (modalRef.current) {
      modalRef.current.classList.add("custom-scrollbar", "fade-zoom-real");
    }
  }, [modalIsOpen]);

  return (
    <div className="min-h-screen bg-gray-100 p-4 md:p-6 lg:p-8" id="products">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Products</h1>
            <nav className="text-sm text-gray-600 mt-1" aria-label="Breadcrumb">
              <ol className="flex items-center space-x-1">
                <li>
                  <a href="#dashboard" className="hover:text-blue-600">
                    Dashboard
                  </a>
                </li>
                <li className="flex items-center space-x-1">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="font-medium">Products</span>
                </li>
              </ol>
            </nav>
          </div>
          <button
            onClick={openAddModal}
            className="mt-4 cursor-pointer md:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition-colors duration-200"
          >
            <FaPlus className="mr-2" />
            Add Product
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="flex-grow">
            <div className="relative">
              <input
                type="text"
                placeholder="Search products..."
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={filters.search}
                onChange={(e) =>
                  dispatch(setFilters({ ...filters, search: e.target.value }))
                }
              />
              <FaSearch className="h-5 w-5 absolute left-3 top-2.5 text-gray-400" />
            </div>
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg appearance-none bg-white"
                value={filters.category}
                onChange={(e) =>
                  dispatch(setFilters({ ...filters, category: e.target.value }))
                }
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="w-full md:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg appearance-none bg-white"
                value={filters.stockStatus}
                onChange={(e) =>
                  dispatch(
                    setFilters({ ...filters, stockStatus: e.target.value })
                  )
                }
              >
                <option value="">Stock Status</option>
                <option value="inStock">In Stock</option>
                <option value="lowStock">Low Stock</option>
                <option value="outOfStock">Out of Stock</option>
              </select>
            </div>
            <button
              onClick={applyFilters}
              className="bg-blue-600 cursor-pointer hover:bg-blue-700 text-white py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
            >
              <FaFilter className="mr-2" />
              Apply
            </button>
            <button
              onClick={handleResetFilters}
              className="bg-gray-200 cursor-pointer hover:bg-gray-300 text-gray-700 py-2 px-4 rounded-lg flex items-center transition-colors duration-200"
            >
              Reset
            </button>
          </div>
        </div>
      </div>

      {/* Products Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading products...</div>
        ) : error ? (
          <div className="p-8 text-center text-red-500">{error}</div>
        ) : (
          <>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Product
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Category
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price (Retail)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Price (Wholesale)
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Stock
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Status
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentProducts.length > 0 ? (
                    currentProducts.map((product) => (
                      <tr key={product._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              <img
                                className="h-10 w-10 rounded-md"
                                src={
                                  product.image ||
                                  "https://placehold.co/40x40?text=TP"
                                }
                                alt={product.name}
                              />
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {product.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                GSM: {product.gsm}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 capitalize">
                            {typeof product.category === "object"
                              ? product.category.name
                              : product.category}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₹{product.priceRetail?.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            ₹{product.priceWholesale?.toFixed(2)}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {product.stock}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStockStatusClass(
                              product.stock
                            )}`}
                          >
                            {getStockStatus(product.stock)}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => openEditModal(product)}
                              className="p-2 cursor-pointer rounded-md text-blue-600 hover:text-white hover:bg-blue-600 transition duration-150 ease-in-out"
                              title="Edit Product"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => openStockModal(product)}
                              className="p-2 cursor-pointer rounded-md text-yellow-600 hover:text-white hover:bg-yellow-600 transition duration-150 ease-in-out"
                              title="Update Stock"
                            >
                              <MdInventory2 className="w-4 h-4" />
                            </button>

                            <button
                              onClick={() => handleDeleteConfirm(product._id)}
                              className={`p-2 rounded-md text-red-600 hover:text-white hover:bg-red-600 transition duration-150 ease-in-out flex items-center justify-center ${
                                deleting
                                  ? "cursor-not-allowed opacity-60"
                                  : "cursor-pointer"
                              }`}
                              title="Delete Product"
                              disabled={deleting}
                            >
                              {deleting ? (
                                <svg
                                  className="w-4 h-4 animate-spin"
                                  fill="none"
                                  viewBox="0 0 24 24"
                                >
                                  <circle
                                    className="opacity-25"
                                    cx="12"
                                    cy="12"
                                    r="10"
                                    stroke="currentColor"
                                    strokeWidth="4"
                                  ></circle>
                                  <path
                                    className="opacity-75"
                                    fill="currentColor"
                                    d="M4 12a8 8 0 018-8v8H4z"
                                  ></path>
                                </svg>
                              ) : (
                                <FaTrash className="w-4 h-4" />
                              )}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td
                        colSpan="7"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No products found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {totalProducts > 0 && (
              <div className="bg-white px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
                <div className="flex-1 flex justify-between sm:hidden">
                  <button
                    onClick={() =>
                      handlePageChange(Math.max(reduxCurrentPage - 1, 1))
                    }
                    disabled={reduxCurrentPage === 1}
                    className="relative cursor-pointer inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Previous
                  </button>
                  <button
                    onClick={() =>
                      handlePageChange(
                        Math.min(reduxCurrentPage + 1, totalPages)
                      )
                    }
                    disabled={reduxCurrentPage === totalPages}
                    className="ml-3 cursor-pointer relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                  >
                    Next
                  </button>
                </div>
                <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                  <div>
                    <p className="text-sm text-gray-700">
                      Showing{" "}
                      <span className="font-medium">
                        {indexOfFirstProduct + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastProduct, totalProducts)}
                      </span>{" "}
                      of <span className="font-medium">{totalProducts}</span>{" "}
                      results
                    </p>
                  </div>
                  <div>
                    <nav
                      className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px"
                      aria-label="Pagination"
                    >
                      <button
                        onClick={() =>
                          handlePageChange(Math.max(reduxCurrentPage - 1, 1))
                        }
                        disabled={reduxCurrentPage === 1}
                        className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Previous</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                      {Array.from({ length: totalPages }, (_, index) => (
                        <button
                          key={index + 1}
                          onClick={() => handlePageChange(index + 1)}
                          className={`relative cursor-pointer inline-flex items-center px-4 py-2 border text-sm font-medium ${
                            reduxCurrentPage === index + 1
                              ? "z-10 bg-blue-50 border-blue-500 text-blue-600"
                              : "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
                          }`}
                        >
                          {index + 1}
                        </button>
                      ))}
                      <button
                        onClick={() =>
                          handlePageChange(
                            Math.min(reduxCurrentPage + 1, totalPages)
                          )
                        }
                        disabled={reduxCurrentPage === totalPages}
                        className="relative cursor-pointer inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50"
                      >
                        <span className="sr-only">Next</span>
                        <svg
                          className="h-5 w-5"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox="0 0 20 20"
                          fill="currentColor"
                          aria-hidden="true"
                        >
                          <path
                            fillRule="evenodd"
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      </button>
                    </nav>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Product Modal"
        ref={null} // do NOT use this
        // 👇 use a content element callback instead:
        contentElement={(props, children) => (
          <div {...props} className="custom-scrollbar fade-zoom-real">
            {children}
          </div>
        )}
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isEditMode ? "Edit Product" : "Add Product"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "name", placeholder: "Product Name" },
                { name: "gsm", placeholder: "GSM" },
                { name: "priceRetail", placeholder: "Retail Price" },
                { name: "priceWholesale", placeholder: "Wholesale Price" },
                { name: "stock", placeholder: "Stock" },
                { name: "unit", placeholder: "Unit" },
              ].map((field) => (
                <input
                  key={field.name}
                  type="text"
                  name={field.name}
                  value={formData[field.name]}
                  onChange={handleInputChange}
                  placeholder={field.placeholder}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                  required
                />
              ))}
            </div>

            {/* Description */}
            <textarea
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />

            {/* Category Dropdown */}
            <select
              name="category"
              value={formData.category}
              onChange={handleInputChange}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
              required
            >
              <option value="">Select Category</option>
              {categories.map((cat) => (
                <option key={cat._id} value={cat._id}>
                  {cat.name}
                </option>
              ))}
            </select>

            {/* File Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center bg-gray-50 hover:bg-gray-100 transition">
                <input
                  type="file"
                  onChange={handleImageChange}
                  accept="image/*"
                  className="hidden"
                  id="file-upload"
                />
                <label
                  htmlFor="file-upload"
                  className="cursor-pointer text-blue-600 font-medium hover:underline"
                >
                  Click to upload or drag and drop
                </label>
                <p className="text-sm text-gray-500 mt-1">
                  PNG, JPG, GIF up to 5MB
                </p>
              </div>
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="mt-4 h-24 object-contain rounded"
                />
              )}
            </div>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="submit"
                disabled={isSubmitting}
                className={`flex cursor-pointer items-center justify-center gap-2 px-5 py-2 font-medium text-white rounded-md transition transform active:scale-95 ${
                  isSubmitting
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {isSubmitting ? (
                  <>
                    <FaSpinner className="animate-spin" />
                    Processing...
                  </>
                ) : isEditMode ? (
                  "Update"
                ) : (
                  "Create"
                )}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="bg-gray-200 cursor-pointer text-gray-700 px-5 py-2 rounded-md hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      {/* Confirm Dialog Box */}
      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        loading={isDeletingNow}
        title="Delete this product?"
        message="Are you sure you want to delete this product? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />

      {/* Update Stock */}
      <UpdateStockModal
        isOpen={stockModalOpen}
        onClose={() => setStockModalOpen(false)}
        product={selectedProduct}
      />
    </div>
  );
};

export default Products;
