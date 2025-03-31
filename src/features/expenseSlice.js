import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// 🔹 Fetch expenses (with optional filters like category, dateRange, search)
export const fetchExpenses = createAsyncThunk(
  "expenses/fetchAll",
  async (params, thunkAPI) => {
    try {
      const res = await api.get("/expenses", { params });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch expenses"
      );
    }
  }
);

// 🔹 Create new expense
export const createExpense = createAsyncThunk(
  "expenses/create",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/expenses", data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to add expense"
      );
    }
  }
);

// 🔹 Update expense
export const updateExpense = createAsyncThunk(
  "expenses/update",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/expenses/${id}`, data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update expense"
      );
    }
  }
);

// 🔹 Delete expense
export const deleteExpense = createAsyncThunk(
  "expenses/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/expenses/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete expense"
      );
    }
  }
);

// 🔹 Get expenses by category
export const fetchExpensesByCategory = createAsyncThunk(
  "expenses/fetchByCategory",
  async (category, thunkAPI) => {
    try {
      const res = await api.get(`/expenses/category/${category}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to filter expenses"
      );
    }
  }
);

export const fetchExpenseTrend = createAsyncThunk(
  "expenses/fetchExpenseTrend",
  async (_, thunkAPI) => {
    try {
      const res = await api.get("/expenses/trend/monthly");
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to load trends"
      );
    }
  }
);

const expenseSlice = createSlice({
  name: "expenses",
  initialState: {
    expenses: [],
    total: 0,
    trend: [],
    trendLoading: false,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    currentPage: 1,
    filters: {
      page: 1,
      limit: 10,
      category: "",
      search: "",
      dateRange: null,
    },
  },
  reducers: {
    setExpenseFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetExpenseFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        category: "",
        search: "",
        dateRange: null,
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchExpenses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchExpenses.fulfilled, (state, action) => {
        state.loading = false;
        state.expenses = action.payload.expenses || action.payload;
        state.total = action.payload.total || 0;
      })
      .addCase(fetchExpenses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createExpense.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createExpense.fulfilled, (state, action) => {
        state.creating = false;
        state.expenses.unshift(action.payload);
      })
      .addCase(createExpense.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateExpense.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateExpense.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.expenses.findIndex(
          (e) => e._id === action.payload._id
        );
        if (index !== -1) state.expenses[index] = action.payload;
      })
      .addCase(updateExpense.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteExpense.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteExpense.fulfilled, (state, action) => {
        state.deleting = false;
        state.expenses = state.expenses.filter((e) => e._id !== action.payload);
      })
      .addCase(deleteExpense.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      .addCase(fetchExpenseTrend.pending, (state) => {
        state.trendLoading = true;
      })
      .addCase(fetchExpenseTrend.fulfilled, (state, action) => {
        state.trendLoading = false;
        state.trend = action.payload;
      })
      .addCase(fetchExpenseTrend.rejected, (state) => {
        state.trendLoading = false;
      })

      // Filter by category
      .addCase(fetchExpensesByCategory.fulfilled, (state, action) => {
        state.expenses = action.payload;
      });
  },
});

export const { setExpenseFilters, resetExpenseFilters } = expenseSlice.actions;

export default expenseSlice.reducer;
