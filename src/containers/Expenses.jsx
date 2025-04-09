import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchExpenses,
  fetchExpensesByCategory,
  createExpense,
  updateExpense,
  deleteExpense,
} from "../features/expenseSlice";
import { FaTrash, FaEdit, FaFilter, FaPlus } from "react-icons/fa";
import { toast } from "react-toastify";
import { format } from "date-fns";
import { Pie } from "react-chartjs-2";
import { Line } from "react-chartjs-2";
import Chart from "chart.js/auto";

const Expenses = () => {
  const dispatch = useDispatch();
  const { expenses, loading } = useSelector((state) => state.expenses);

  const [selectedCategory, setSelectedCategory] = useState("all");
  const [formVisible, setFormVisible] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    category: "",
    amount: "",
    note: "",
    expenseDate: "",
  });
  const [editId, setEditId] = useState(null);

  const categories = ["Worker", "RawMaterial", "Daily", "Transport"];

  useEffect(() => {
    if (selectedCategory === "all") {
      dispatch(fetchExpenses());
    } else {
      dispatch(fetchExpensesByCategory(selectedCategory));
    }
  }, [selectedCategory]);

  const handleDelete = async (id) => {
    const res = await dispatch(deleteExpense(id));
    if (res.meta.requestStatus === "fulfilled") {
      toast.success("Expense deleted");
    }
  };

  const handleEdit = (expense) => {
    setFormVisible(true);
    setEditMode(true);
    setEditId(expense._id);
    setFormData({
      title: expense.title,
      category: expense.category,
      amount: expense.amount,
      note: expense.note,
      expenseDate: expense.expenseDate?.split("T")[0],
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const action = editMode
      ? updateExpense({ id: editId, data: formData })
      : createExpense(formData);

    const res = await dispatch(action);
    if (res.meta.requestStatus === "fulfilled") {
      toast.success(`Expense ${editMode ? "updated" : "added"} successfully`);
      setFormData({
        title: "",
        category: "",
        amount: "",
        note: "",
        expenseDate: "",
      });
      setEditMode(false);
      setFormVisible(false);
      setEditId(null);
      dispatch(fetchExpenses());
    }
  };

  const totalAmount = expenses.reduce((sum, e) => sum + e.amount, 0);

  const pieData = {
    labels: categories,
    datasets: [
      {
        label: "Expenses",
        data: categories.map(
          (cat) =>
            expenses
              .filter((e) => e.category === cat)
              .reduce((sum, e) => sum + e.amount, 0) || 0
        ),
        backgroundColor: ["#60a5fa", "#34d399", "#fbbf24", "#f87171"],
        borderWidth: 1,
      },
    ],
  };

  // Group expenses by date (format: dd MMM)
  const trendLabels = [];
  const trendMap = {};

  expenses.forEach((e) => {
    const date = format(new Date(e.expenseDate), "dd MMM");
    trendMap[date] = (trendMap[date] || 0) + e.amount;
  });

  for (const date in trendMap) {
    trendLabels.push(date);
  }

  const trendData = {
    labels: trendLabels,
    datasets: [
      {
        label: "Total Expenses",
        data: trendLabels.map((date) => trendMap[date]),
        fill: false,
        borderColor: "#C41E3A", // Tailwind blue-600
        backgroundColor: "#C41E3A",
        tension: 0.4,
      },
    ],
  };

  return (
    <div className="min-h-screen bg-gray-100" id="expenses">
      <div className="mb-6">
        {/* Breadcrumb Style Heading */}
        <div className="mb-1">
          <a className="text-sm text-gray-500" href="#dashboard">Dashboard</a>
          <span className="mx-1 text-sm text-gray-400">›</span>
          <span className="text-sm font-medium text-gray-700">Expenses</span>
        </div>
        <h2 className="text-2xl font-bold text-gray-800">Expenses Overview</h2>
      </div>

      {/* Action Buttons and Filter */}
      <div className="flex flex-col sm:flex-row justify-between items-center mb-6">
        <div className="flex gap-3 items-center mt-4 sm:mt-0 w-full sm:w-auto">
          <button
            className="bg-blue-600 cursor-pointer text-sm text-white px-4 py-2 rounded-md hover:bg-blue-700 transition flex items-center gap-2"
            onClick={() => {
              setFormVisible(!formVisible);
              setFormData({
                title: "",
                category: "",
                amount: "",
                note: "",
                expenseDate: "",
              });
              setEditMode(false);
            }}
          >
            {formVisible ? "Cancel" : "Add Expense"}
          </button>

          {/* Filter Select */}
          <div className="relative">
            <select
              className="appearance-none cursor-pointer border border-gray-300 text-sm text-gray-700 rounded-md px-3 py-2 pl-8 bg-white shadow-sm hover:border-gray-400 transition"
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="all">All Categories</option>
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            <FaFilter className="absolute top-2.5 left-2.5 text-gray-500 text-xs pointer-events-none" />
          </div>
        </div>
      </div>

      {formVisible && (
        <form
          onSubmit={handleFormSubmit}
          className="grid text-sm grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5 mb-6 bg-white shadow-md p-6 rounded-xl"
        >
          {/* Title */}
          <input
            type="text"
            placeholder="Expense Title"
            value={formData.title}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, title: e.target.value }))
            }
            className="px-4 py-2 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />

          {/* Category */}
          <select
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value }))
            }
            className="px-4 py-2 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Amount */}
          <input
            type="number"
            placeholder="Amount"
            value={formData.amount}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, amount: e.target.value }))
            }
            className="px-4 py-2 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
            required
          />

          {/* Date */}
          <input
            type="date"
            value={formData.expenseDate}
            onChange={(e) =>
              setFormData((prev) => ({
                ...prev,
                expenseDate: e.target.value,
              }))
            }
            className="px-4 py-2 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          />

          {/* Note */}
          <textarea
            placeholder="Note (optional)"
            value={formData.note}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, note: e.target.value }))
            }
            rows="2"
            className="col-span-full px-4 py-2 rounded-lg ring-1 ring-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none transition"
          ></textarea>

          {/* Submit Button */}
          <button
            type="submit"
            className="col-span-full cursor-pointer sm:col-span-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md transition"
          >
            {editMode ? "Update Expense" : "Add Expense"}
          </button>
        </form>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-blue-100 text-blue-800 px-4 py-3 rounded-lg shadow text-center">
          <p className="text-sm font-medium">Total Expenses</p>
          <p className="text-xl font-bold">₹{totalAmount.toLocaleString()}</p>
        </div>
        {categories.map((cat) => {
          const catTotal = expenses
            .filter((e) => e.category === cat)
            .reduce((sum, e) => sum + e.amount, 0);
          return (
            <div
              key={cat}
              className="bg-white border border-gray-200 px-4 py-3 rounded-lg shadow text-center"
            >
              <p className="text-sm text-gray-600">{cat}</p>
              <p className="text-lg font-semibold text-gray-800">
                ₹{catTotal.toLocaleString()}
              </p>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Pie Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm flex flex-col items-center justify-center">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Expense Distribution
          </h4>
          <div className="w-full flex justify-center items-center h-[260px] max-w-xs sm:max-w-sm md:max-w-md">
            <Pie data={pieData} />
          </div>
        </div>

        {/* Line Chart */}
        <div className="bg-white p-6 rounded-xl shadow-sm">
          <h4 className="text-lg font-semibold text-gray-800 mb-4 text-center">
            Expense Trend
          </h4>
          <div className="w-full h-[260px]">
            <Line
              data={trendData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: "bottom",
                    labels: {
                      padding: 20,
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {expenses.map((e) => (
          <div
            key={e._id}
            className="bg-white rounded-lg border border-gray-200 shadow-sm p-5 flex flex-col justify-between"
          >
            <div className="mb-3">
              <h3 className="text-lg font-semibold text-gray-800">{e.title}</h3>
              <p className="text-sm text-gray-500">{e.category}</p>
              <p className="text-sm mt-1 text-gray-700">{e.note || "-"}</p>
            </div>
            <div className="flex items-center justify-between mt-auto">
              <div>
                <p className="text-base font-bold text-green-600">
                  ₹{e.amount.toLocaleString()}
                </p>
                <p className="text-xs text-gray-500">
                  {format(new Date(e.expenseDate), "dd MMM yyyy")}
                </p>
              </div>
              <div className="flex gap-4">
                <button
                  onClick={() => handleEdit(e)}
                  className="text-blue-600 hover:text-blue-800 text-sm transition cursor-pointer"
                  title="Edit"
                >
                  <FaEdit className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(e._id)}
                  className="text-red-500 hover:text-red-700 text-sm transition cursor-pointer"
                  title="Delete"
                >
                  <FaTrash className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {!loading && expenses.length === 0 && (
        <p className="text-center text-gray-500 mt-8">
          No expenses found in this category.
        </p>
      )}
    </div>
  );
};

export default Expenses;
