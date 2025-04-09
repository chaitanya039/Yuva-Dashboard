import { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import {
  fetchCustomers,
  createCustomer,
  updateCustomer,
  deleteCustomer,
  setCustomerFilters,
  resetCustomerFilters,
} from "../features/customerSlice";
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
import ConfirmDialog from "../components/ConfirmDialog";

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

const Customers = () => {
  const dispatch = useDispatch();
  const {
    customers,
    loading,
    error,
    creating,
    updating,
    deleting,
    filters,
    total,
    currentPage: reduxCurrentPage,
  } = useSelector((state) => state.customers);

  // State for dialog
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedCustomerId, setSelectedCustomerId] = useState(null);
  const [isDeletingNow, setIsDeletingNow] = useState(false);

  // Local state for form and modal
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCustomer, setCurrentCustomer] = useState(null);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    type: "",
    city: "",
    profileImg: null,
  });
  const [imagePreview, setImagePreview] = useState("");

  // Constants
  const customersPerPage = 10;

  // Fetch customers when filters or page change
  useEffect(() => {
    dispatch(
      fetchCustomers({
        ...filters,
        page: reduxCurrentPage,
        limit: customersPerPage,
      })
    );
  }, [dispatch, filters, reduxCurrentPage]);

  // Handle errors
  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
        profileImg: file,
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
    setCurrentCustomer(null);
    setFormData({
      name: "",
      email: "",
      phone: "",
      type: "",
      city: "",
      profileImg: null,
    });
    setImagePreview("");
    setModalIsOpen(true);
  };

  const openEditModal = (customer) => {
    setIsEditMode(true);
    setCurrentCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      type: customer.type,
      city: customer.city,
      profileImg: null,
    });
    setImagePreview(customer.profileImg || "");
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  // Form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Log the formData object before appending to FormData
    console.log("Form Data:", formData);

    const data = new FormData();
    data.append("name", formData.name);
    data.append("email", formData.email);
    data.append("phone", formData.phone);
    data.append("type", formData.type);
    data.append("city", formData.city);
    if (formData.profileImg) {
      data.append("profileImg", formData.profileImg);
    }

    // Default password if not already included
    data.append("password", "111111");

    try {
      if (isEditMode) {
        await dispatch(
          updateCustomer({ id: currentCustomer._id, data })
        ).unwrap();
        toast.success("Customer updated successfully");
      } else {
        await dispatch(createCustomer(data)).unwrap();
        toast.success("Customer created successfully");
      }
      closeModal();
    } catch (error) {
      console.error("Form submission failed:", error);
      toast.error("Operation failed. Please try again.");
    }
  };

  // Customer Deletion
  const handleDeleteConfirm = (id) => {
    setSelectedCustomerId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeletingNow(true);
    try {
      await dispatch(deleteCustomer(selectedCustomerId)).unwrap();
      toast.success("Customer deleted successfully");
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
    dispatch(setCustomerFilters({ ...filters, page: 1 }));
  };

  const handleResetFilters = () => {
    dispatch(resetCustomerFilters());
  };

  // Pagination
  const handlePageChange = (page) => {
    dispatch(setCustomerFilters({ ...filters, page }));
  };

  // Calculate pagination values
  const totalPages = Math.ceil(total / customersPerPage);
  const indexOfLastCustomer = reduxCurrentPage * customersPerPage;
  const indexOfFirstCustomer = indexOfLastCustomer - customersPerPage;
  const currentCustomers = customers.slice(
    indexOfFirstCustomer,
    indexOfLastCustomer
  );

  // Function to render customer initials if no profile image
  const renderCustomerInitials = (name) => {
    const initials = name
      .split(" ")
      .map((word) => word[0].toUpperCase())
      .join("");
    return (
      <div className="w-10 h-10 flex items-center justify-center bg-blue-500 text-white rounded-full">
        {initials}
      </div>
    );
  };

  // Function to get type styling
  const getTypeStyle = (type) => {
    if (type === "Retailer") {
      return "bg-green-100 text-green-700";
    }
    if (type === "Wholesaler") {
      return "bg-blue-100 text-blue-700";
    }
    return "bg-gray-100 text-gray-700";
  };

  return (
    <div className="min-h-screen bg-gray-100" id="customers">
      {/* Header & Breadcrumbs */}
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>
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
                  <span className="font-medium">Customers</span>
                </li>
              </ol>
            </nav>
          </div>
          <button
            onClick={openAddModal}
            className="mt-4 cursor-pointer md:mt-0 bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md flex items-center transition-colors duration-200"
          >
            <FaPlus className="mr-2" />
            Add Customer
          </button>
        </div>
      </div>

      {/* Filters and Search */}
      <div className="bg-white rounded-lg shadow mb-6 p-4">
        <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
          <div className="relative flex-grow">
            <input
              type="text"
              placeholder="Search customers..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={filters.search}
              onChange={(e) =>
                dispatch(
                  setCustomerFilters({ ...filters, search: e.target.value })
                )
              }
            />
            <FaSearch className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
          </div>
          <div className="flex flex-col md:flex-row space-y-4 md:space-y-0 md:space-x-4">
            <div className="w-full md:w-auto">
              <select
                className="block w-full pl-3 pr-10 py-2 text-base border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 rounded-lg appearance-none bg-white"
                value={filters.type}
                onChange={(e) =>
                  dispatch(
                    setCustomerFilters({ ...filters, type: e.target.value })
                  )
                }
              >
                <option value="">All Types</option>
                <option value="Retailer">Retailer</option>
                <option value="Wholesaler">Wholesaler</option>
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

      {/* Customers Table */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-8 text-center">Loading customers...</div>
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
                      Customer
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Type
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Email
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Phone
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
                  {currentCustomers.length > 0 ? (
                    currentCustomers.map((customer) => (
                      <tr key={customer._id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="flex-shrink-0 h-10 w-10">
                              {customer.profileImg ? (
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={
                                    customer.profileImg ||
                                    "https://placehold.co/40x40?text=TP"
                                  }
                                  alt={customer.name}
                                />
                              ) : (
                                renderCustomerInitials(customer.name)
                              )}
                            </div>
                            <div className="ml-4">
                              <div className="text-sm font-medium text-gray-900">
                                {customer.name}
                              </div>
                              <div className="text-sm text-gray-500">
                                {customer.email}
                              </div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span
                            className={`text-sm ${getTypeStyle(
                              customer.type
                            )} px-3 py-1 font-medium rounded-full capitalize`}
                          >
                            {customer.type}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.email}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900">
                            {customer.phone}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end items-center gap-2">
                            <button
                              onClick={() => openEditModal(customer)}
                              className="p-2 cursor-pointer rounded-md text-blue-600 hover:text-white hover:bg-blue-600 transition duration-150 ease-in-out"
                              title="Edit Customer"
                            >
                              <FaEdit className="w-4 h-4" />
                            </button>
                            <button
                              onClick={() => handleDeleteConfirm(customer._id)}
                              className={`p-2 rounded-md text-red-600 hover:text-white hover:bg-red-600 transition duration-150 ease-in-out flex items-center justify-center ${
                                deleting
                                  ? "cursor-not-allowed opacity-60"
                                  : "cursor-pointer"
                              }`}
                              title="Delete Customer"
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
                        colSpan="5"
                        className="px-6 py-4 text-center text-gray-500"
                      >
                        No customers found
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            {total > 0 && (
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
                        {indexOfFirstCustomer + 1}
                      </span>{" "}
                      to{" "}
                      <span className="font-medium">
                        {Math.min(indexOfLastCustomer, total)}
                      </span>{" "}
                      of <span className="font-medium">{total}</span> results
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
        contentLabel="Customer Modal"
      >
        <div className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800">
            {isEditMode ? "Edit Customer" : "Add Customer"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Input Fields Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                { name: "name", placeholder: "Customer Name" },
                { name: "email", placeholder: "Email" },
                { name: "phone", placeholder: "Phone Number" },
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
              {/* Customer Type */}
              <div>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
                >
                  <option value="">Select Type</option>
                  <option value="Retailer">Retailer</option>
                  <option value="Wholesaler">Wholesaler</option>
                </select>
              </div>
            </div>

            {/* city */}
            <textarea
              name="city"
              value={formData.city}
              onChange={handleInputChange}
              placeholder="City"
              rows="3"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition duration-150"
            />

            {/* Profile Image */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Upload Profile Image
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

            {/* Submit Buttons */}
            <div className="flex justify-end space-x-3 mt-4">
              <button
                type="submit"
                disabled={creating || updating}
                className={`flex cursor-pointer items-center justify-center gap-2 px-5 py-2 font-medium text-white rounded-md transition transform active:scale-95 ${
                  creating || updating
                    ? "bg-blue-400 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {creating || updating ? (
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
        title="Delete this customer?"
        message="Are you sure you want to delete this customer? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Customers;
