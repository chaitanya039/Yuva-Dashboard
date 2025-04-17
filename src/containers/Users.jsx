// pages/Users.jsx

import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
  toggleUserStatus,
  fetchRoles,
} from "../features/userSlice";
import ConfirmDialog from "../components/ConfirmDialog";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import { FaEdit, FaPlusCircle, FaTrash, FaShieldAlt } from "react-icons/fa";
import { Link } from "react-router-dom";

const Users = () => {
  const dispatch = useDispatch();
  const {
    list: users,
    loading,
    roles,
    error,
  } = useSelector((state) => state.users);
  const currentUser = useSelector((state) => state.auth.user);

  const [filters, setFilters] = useState({ search: "", role: "", status: "" });
  const [selectedUser, setSelectedUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [userToDelete, setUserToDelete] = useState(null);
  const [showFormModal, setShowFormModal] = useState(false);
  const [imagePreview, setImagePreview] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const modalRef = useRef();

  useEffect(() => {
    if (selectedUser?.profileImg && !imagePreview) {
      setImagePreview(selectedUser.profileImg);
    }
  }, [selectedUser]);

  useEffect(() => {
    dispatch(fetchUsers(filters)).then((res) => {
      if (res.payload?.statusCode === 403) {
        toast.error("You don’t have permission to access this page.");
      }
    });
    dispatch(fetchRoles());
  }, [dispatch, filters]);

  const handleEdit = async (id) => {
    const res = await dispatch(getUserById(id));
    if (res.meta.requestStatus === "fulfilled") {
      setSelectedUser(res.payload);
      setIsEditing(true);
      setShowFormModal(true);
    } else if (res.payload?.statusCode === 403) {
      toast.error("You don’t have permission to access this page.");
    }
  };

  const handleDeleteConfirm = (id) => {
    setUserToDelete(id);
    setShowConfirm(true);
  };

  const confirmDelete = async () => {
    const res = await dispatch(deleteUser(userToDelete));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("User deleted successfully");
      dispatch(fetchUsers(filters));
    } else {
      if (res.payload?.statusCode === 403) {
        toast.error("You don’t have permission to delete this user.");
      } else {
        toast.error(res.payload || "Failed to delete user");
      }
    }
    setShowConfirm(false);
    setUserToDelete(null);
  };

  const handleToggleStatus = async (id) => {
    const res = await dispatch(toggleUserStatus(id));
    if (res.payload?.statusCode === 403) {
      toast.error("You don’t have permission to update user status.");
    } else {
      dispatch(fetchUsers(filters));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    const formData = new FormData(e.target);
    const action = isEditing ? updateUser : createUser;
    const payload = isEditing ? { id: selectedUser._id, formData } : formData;

    if (
      !formData.get("name") ||
      !formData.get("email") ||
      (!isEditing && !formData.get("password"))
    ) {
      toast.error("Please fill all required fields");
      setIsSubmitting(false);
      return;
    }

    const res = await dispatch(action(payload));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success(`User ${isEditing ? "updated" : "created"} successfully`);
      setSelectedUser(null);
      setIsEditing(false);
      setShowFormModal(false);
      dispatch(fetchUsers(filters));
    } else {
      if (res.payload?.statusCode === 403) {
        toast.error("You don’t have permission to perform this action.");
      } else {
        toast.error(res.payload || "Operation failed");
      }
    }

    setIsSubmitting(false);
  };

  const handleOutsideClick = (e) => {
    if (modalRef.current && !modalRef.current.contains(e.target)) {
      setShowFormModal(false);
    }
  };

  useEffect(() => {
    if (showFormModal) {
      document.addEventListener("mousedown", handleOutsideClick);
    } else {
      document.removeEventListener("mousedown", handleOutsideClick);
    }
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, [showFormModal]);

  return (
    <div className="bg-gradient-to-br from-gray-100 to-white min-h-screen text-sm">
      <div className="mb-4 text-gray-600 font-semibold">
        <Link
          to={"/dashboard"}
          className="text-gray-600 font-normal cursor-pointer"
        >
          Dashboard &gt;
        </Link>{" "}
         Users
      </div>

      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">User Management</h1>
        <button
          onClick={() => {
            setIsEditing(false);
            setSelectedUser(null);
            setShowFormModal(true);
          }}
          className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg shadow-sm cursor-pointer"
        >
          <FaPlusCircle className="inline me-1 mb-0.5" /> Add User
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-5">
        <input
          type="text"
          placeholder="Search by name or email..."
          className="p-2 border border-gray-300 rounded-lg shadow"
          value={filters.search}
          onChange={(e) =>
            setFilters((f) => ({ ...f, search: e.target.value }))
          }
        />
        <select
          className="p-2 border border-gray-300 rounded-lg shadow"
          value={filters.role}
          onChange={(e) => setFilters((f) => ({ ...f, role: e.target.value }))}
        >
          <option value="">All Roles</option>
          {roles.map((role) => (
            <option key={role._id} value={role.name}>
              {role.name}
            </option>
          ))}
        </select>
        <select
          className="p-2 border border-gray-300 rounded-lg shadow"
          value={filters.status}
          onChange={(e) =>
            setFilters((f) => ({ ...f, status: e.target.value }))
          }
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </select>
      </div>

      {loading ? (
        <p className="text-gray-600">Loading...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <div className="overflow-x-auto rounded-xl shadow bg-white">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-gray-100 text-gray-600 uppercase">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Email</th>
                <th className="p-4">Role</th>
                <th className="p-4">Status</th>
                <th className="p-4">Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr
                  key={user._id}
                  className={`border-t hover:bg-gray-50 ${
                    currentUser?._id === user._id ? "bg-blue-50/30" : ""
                  }`}
                >
                  <td className="p-4 flex items-center gap-2">
                    {user.profileImg && (
                      <img
                        src={user.profileImg}
                        alt="profile"
                        className="w-8 h-8 rounded-full object-cover"
                      />
                    )}
                    <span>{user.name}</span>
                    {user.isSuperAdmin && (
                      <span
                        title="Super Admin"
                        className="flex items-center gap-1 bg-yellow-100 text-yellow-800 text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        <FaShieldAlt className="text-yellow-600" /> Super
                      </span>
                    )}
                    {currentUser?._id === user._id && (
                      <span
                        title="This is you"
                        className="bg-black text-white text-xs font-medium px-2 py-0.5 rounded-full"
                      >
                        You
                      </span>
                    )}
                  </td>
                  <td className="p-4">{user.email}</td>
                  <td className="p-4">{user.role?.name}</td>
                  <td className="p-4">
                    <button
                      onClick={() => handleToggleStatus(user._id)}
                      className={`px-3 py-1 rounded-full text-xs font-medium shadow cursor-pointer ${
                        user.status
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {user.status ? "Active" : "Inactive"}
                    </button>
                  </td>
                  <td className="p-4">
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(user._id)}
                        className="p-2 rounded-full bg-blue-100 text-blue-600 hover:bg-blue-200 transition-all duration-200 shadow-sm"
                        title="Edit"
                      >
                        <FaEdit className="w-4 h-4" />
                      </button>
                      {!user.isSuperAdmin && (
                        <button
                          onClick={() => handleDeleteConfirm(user._id)}
                          className="p-2 rounded-full bg-red-100 text-red-600 hover:bg-red-200 transition-all duration-200 shadow-sm"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <AnimatePresence>
        {showFormModal && (
          <motion.div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              ref={modalRef}
              className="bg-white p-6 rounded-2xl shadow-2xl w-full max-w-md relative"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.8, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <button
                onClick={() => setShowFormModal(false)}
                className="absolute top-3 right-4 text-gray-400 hover:text-red-500 text-2xl"
              >
                &times;
              </button>

              <h2 className="text-xl font-semibold mb-5 text-center">
                {isEditing ? "Edit User" : "Create User"}
              </h2>

              <form
                onSubmit={handleSubmit}
                className="space-y-4"
                encType="multipart/form-data"
              >
                <input
                  type="text"
                  name="name"
                  defaultValue={selectedUser?.name || ""}
                  placeholder="Full Name"
                  className="w-full py-2 px-4 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  autoFocus
                  required
                />
                <input
                  type="email"
                  name="email"
                  defaultValue={selectedUser?.email || ""}
                  placeholder="Email"
                  className="w-full py-2 px-4 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
                {!isEditing && (
                  <input
                    type="password"
                    name="password"
                    placeholder="Password"
                    className="w-full py-2 px-4 border rounded text-sm outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                )}
                <select
                  name="roleName"
                  defaultValue={selectedUser?.role?.name || ""}
                  className="w-full py-2 px-4 border rounded text-sm text-gray-700 outline-none focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Role</option>
                  {roles.map((role) => (
                    <option key={role._id} value={role.name}>
                      {role.name}
                    </option>
                  ))}
                </select>
                <div className="flex items-center gap-4">
                  <input
                    type="file"
                    name="profileImg"
                    accept="image/*"
                    onChange={(e) => {
                      const file = e.target.files[0];
                      if (file) {
                        const reader = new FileReader();
                        reader.onloadend = () => setImagePreview(reader.result);
                        reader.readAsDataURL(file);
                      } else {
                        setImagePreview(null);
                      }
                    }}
                    className="text-sm"
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      className="w-12 h-12 rounded-full object-cover border"
                    />
                  )}
                </div>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className={`w-full py-2 rounded text-sm transition flex items-center justify-center gap-2 ${
                    isSubmitting
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 text-white"
                  }`}
                >
                  {isSubmitting && (
                    <svg
                      className="w-4 h-4 animate-spin text-white"
                      xmlns="http://www.w3.org/2000/svg"
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
                        d="M4 12a8 8 0 018-8v4l3.5-3.5L12 0v4a8 8 0 00-8 8z"
                      ></path>
                    </svg>
                  )}
                  {isSubmitting
                    ? isEditing
                      ? "Updating..."
                      : "Creating..."
                    : isEditing
                    ? "Update User"
                    : "Create User"}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <ConfirmDialog
        isOpen={showConfirm}
        onClose={() => setShowConfirm(false)}
        onConfirm={confirmDelete}
        title="Delete User"
        message="Are you sure you want to delete this user? This action cannot be undone."
      />
    </div>
  );
};

export default Users;
