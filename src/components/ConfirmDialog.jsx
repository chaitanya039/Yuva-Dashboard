import React from "react";
import Modal from "react-modal";

const ConfirmDialog = ({
  isOpen,
  onClose,
  onConfirm,
  title = "Are you sure?",
  message = "This action cannot be undone.",
  confirmText = "Yes, Delete",
  cancelText = "Cancel",
  loading = false,
}) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Confirmation Dialog"
      shouldCloseOnOverlayClick={!loading}
      className="bg-white p-6 rounded-lg shadow-md h-fit max-w-sm mx-auto mt-10 outline-none animate-fade-slide"
      overlayClassName="fixed inset-0 bg-black/40 flex justify-center pt-10 z-50"
    >
      <h2 className="text-lg font-semibold text-gray-800 mb-2">{title}</h2>
      <p className="text-sm text-gray-600 mb-4">{message}</p>
      <div className="flex justify-end gap-2">
        <button
          onClick={onClose}
          disabled={loading}
          className="px-4 cursor-pointer py-2 bg-gray-100 hover:bg-gray-200 rounded text-gray-700 text-sm"
        >
          {cancelText}
        </button>
        <button
          onClick={onConfirm}
          disabled={loading}
          className={`px-4 cursor-pointer py-2 text-sm rounded text-white ${
            loading
              ? "bg-red-300 cursor-not-allowed"
              : "bg-red-600 hover:bg-red-700"
          }`}
        >
          {loading ? "Deleting..." : confirmText}
        </button>
      </div>
    </Modal>
  );
};

export default ConfirmDialog;
