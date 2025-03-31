// Categories.jsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../features/categorySlice";
import { toast } from "react-toastify";
import Modal from "react-modal";
import ConfirmDialog from "../components/ConfirmDialog";
import { FaEdit, FaTrash, FaPlus, FaSpinner, FaSearch } from "react-icons/fa";

Modal.setAppElement("#root");

const customModalStyles = {
  content: {
    top: "50%",
    left: "50%",
    right: "auto",
    bottom: "auto",
    transform: "translate(-50%, -50%)",
    width: "90%",
    maxWidth: "500px",
    padding: 0,
    border: "none",
    borderRadius: "0.5rem",
    maxHeight: "90vh",
    overflowY: "auto",
    boxShadow:
      "0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)",
  },
  overlay: {
    backgroundColor: "rgba(0,0,0,0.5)",
    zIndex: 1000,
  },
};

const Categories = () => {
  const dispatch = useDispatch();
  const { categories, loading, creating, updating, deleting } = useSelector(
    (state) => state.categories
  );

  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [formData, setFormData] = useState({ name: "", description: "" });
  const [filter, setFilter] = useState("");
  const [showConfirm, setShowConfirm] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [isDeletingNow, setIsDeletingNow] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const categoriesPerPage = 5;

  useEffect(() => {
    dispatch(fetchCategories());
  }, [dispatch]);

  const openAddModal = () => {
    setIsEditMode(false);
    setFormData({ name: "", description: "" });
    setModalIsOpen(true);
  };

  const openEditModal = (category) => {
    setIsEditMode(true);
    setCurrentCategory(category);
    setFormData({ name: category.name, description: category.description });
    setModalIsOpen(true);
  };

  const closeModal = () => {
    setModalIsOpen(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await dispatch(
          updateCategory({ id: currentCategory._id, data: formData })
        ).unwrap();
        toast.success("Category updated successfully");
      } else {
        await dispatch(createCategory(formData)).unwrap();
        toast.success("Category created successfully");
      }
      closeModal();
    } catch (error) {
      toast.error(error);
    }
  };

  const handleDelete = (id) => {
    setSelectedId(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    setIsDeletingNow(true);
    try {
      await dispatch(deleteCategory(selectedId)).unwrap();
      toast.success("Category deleted successfully");
      setShowConfirm(false);
    } catch (error) {
      toast.error(error);
    } finally {
      setIsDeletingNow(false);
    }
  };

  // Filtered and Paginated Categories
  const filtered = categories.filter(
    (cat) =>
      cat.name.toLowerCase().includes(filter.toLowerCase()) ||
      cat.description.toLowerCase().includes(filter.toLowerCase())
  );

  const totalPages = Math.ceil(filtered.length / categoriesPerPage);
  const currentCategories = filtered.slice(
    (currentPage - 1) * categoriesPerPage,
    currentPage * categoriesPerPage
  );

  return (
    <div className="min-h-screen p-6 bg-gray-100" id="categories">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-800">Categories</h1>
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
                <span className="font-medium">Categories</span>
              </li>
            </ol>
          </nav>
        </div>
        <button
          onClick={openAddModal}
          className="bg-blue-600 cursor-pointer text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <FaPlus className="mr-2" /> Add Category
        </button>
      </div>

      <div className="mb-4">
        <div className="relative">
          <input
            type="text"
            placeholder="Search by name or description..."
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
          <FaSearch className="absolute left-3 top-2.5 text-gray-400" />
        </div>
      </div>

      <div className="bg-white rounded-lg shadow overflow-hidden">
        {loading ? (
          <div className="p-6 text-center">Loading categories...</div>
        ) : (
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Name
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {currentCategories.length > 0 ? (
                currentCategories.map((cat) => (
                  <tr key={cat._id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {cat.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {cat.description}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium flex justify-end gap-2">
                      <button
                        onClick={() => openEditModal(cat)}
                        className="p-2 text-blue-600 cursor-pointer hover:text-white hover:bg-blue-600 rounded-md"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(cat._id)}
                        disabled={deleting}
                        className={`p-2 text-red-600 cursor-pointer hover:text-white hover:bg-red-600 rounded-md ${
                          deleting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                      >
                        {deleting ? (
                          <FaSpinner className="animate-spin" />
                        ) : (
                          <FaTrash className="w-4 h-4" />
                        )}
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="3" className="text-center py-4 text-gray-500">
                    No categories found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex justify-end space-x-2">
          {[...Array(totalPages)].map((_, idx) => (
            <button
              key={idx + 1}
              onClick={() => setCurrentPage(idx + 1)}
              className={`px-3 py-1 cursor-pointer rounded-md text-sm border ${
                currentPage === idx + 1
                  ? "bg-blue-500 text-white border-blue-500"
                  : "bg-white text-gray-700 border-gray-300 hover:bg-gray-100"
              }`}
            >
              {idx + 1}
            </button>
          ))}
        </div>
      )}

      {/* Modal */}
      <Modal
        isOpen={modalIsOpen}
        onRequestClose={closeModal}
        style={customModalStyles}
        contentLabel="Category Modal"
        contentElement={(props, children) => (
          <div {...props} className="custom-scrollbar fade-zoom-real">
            {children}
          </div>
        )}
      >
        <div className="p-6">
          <h2 className="text-xl font-bold mb-4">
            {isEditMode ? "Edit Category" : "Add Category"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <input
              type="text"
              name="name"
              placeholder="Category Name"
              value={formData.name}
              onChange={(e) =>
                setFormData({ ...formData, name: e.target.value })
              }
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
            <textarea
              name="description"
              placeholder="Description"
              value={formData.description}
              onChange={(e) =>
                setFormData({ ...formData, description: e.target.value })
              }
              rows="3"
              className="w-full border border-gray-300 px-4 py-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <div className="flex justify-end gap-2">
              <button
                type="submit"
                disabled={creating || updating}
                className={`px-4 py-2 rounded cursor-pointer text-white ${
                  creating || updating
                    ? "bg-blue-300 cursor-not-allowed"
                    : "bg-blue-600 hover:bg-blue-700"
                }`}
              >
                {creating || updating
                  ? "Saving..."
                  : isEditMode
                  ? "Update"
                  : "Create"}
              </button>
              <button
                type="button"
                onClick={closeModal}
                className="px-4 py-2 rounded cusrosr-pointer bg-gray-200 hover:bg-gray-300 text-gray-700"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      </Modal>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        loading={isDeletingNow}
        title="Delete this category?"
        message="Are you sure you want to delete this category? This action cannot be undone."
        confirmText="Yes, Delete"
        cancelText="Cancel"
      />
    </div>
  );
};

export default Categories;
