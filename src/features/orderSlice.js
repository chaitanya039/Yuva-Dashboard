import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// 🔹 Fetch all orders
export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (params, thunkAPI) => {
    try {
      const res = await api.get("/orders", { params });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

// 🔹 Fetch single order by ID
export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/orders/${id}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

// 🔹 Create order (Admin/Customer)
export const createOrder = createAsyncThunk(
  "orders/createOrder",
  async (data, thunkAPI) => {
    try {
      const res = await api.post("/orders", data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create order"
      );
    }
  }
);

// 🔹 Update existing order
export const updateOrder = createAsyncThunk(
  "orders/updateOrder",
  async ({ id, data }, thunkAPI) => {
    try {
      const res = await api.put(`/orders/${id}`, data);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update order"
      );
    }
  }
);

// 🔹 Fetch recent orders
export const fetchRecentOrders = createAsyncThunk(
  "orders/fetchRecentOrders",
  async (limit = 4, thunkAPI) => {
    try {
      const res = await api.get(`/orders/recent?limit=${limit}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch recent orders"
      );
    }
  }
);

// 🔹 Delete an order
export const deleteOrder = createAsyncThunk(
  "orders/deleteOrder",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/orders/${id}`);
      return id; // return deleted order id
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete order"
      );
    }
  }
);

const orderSlice = createSlice({
  name: "orders",
  initialState: {
    orders: [],
    totalOrders: 0,
    currentOrder: null,
    recentOrders: [],
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    filters: {
      page: 1,
      limit: 4,
      search: "",
      status: "",
      customerType: "",
      paymentStatus: "", // ✅ added
      sortBy: "createdAt",
      sortOrder: "desc",
    },

    error: null,
  },
  reducers: {
    setOrderFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetOrderFilters: (state) => {
      state.filters = {
        ...state.filters, // 👈 retain the existing limit value
        page: 1,
        search: "",
        status: "",
        customerType: "",
        paymentStatus: "", // ✅ added
        sortBy: "createdAt",
        sortOrder: "desc",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch orders
      .addCase(fetchOrders.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.orders = action.payload.orders;
        state.totalOrders = action.payload.total;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Fetch single
      .addCase(fetchOrderById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createOrder.pending, (state) => {
        state.creating = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.creating = false;
        state.orders.unshift(action.payload);
      })
      .addCase(createOrder.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateOrder.pending, (state) => {
        state.updating = true;
      })
      .addCase(updateOrder.fulfilled, (state, action) => {
        state.updating = false;
        const updated = action.payload;
        state.orders = state.orders.map((order) =>
          order._id === updated._id ? updated : order
        );
        if (state.currentOrder && state.currentOrder._id === updated._id) {
          state.currentOrder = updated;
        }
      })
      .addCase(updateOrder.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Recent orders
      .addCase(fetchRecentOrders.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchRecentOrders.fulfilled, (state, action) => {
        state.loading = false;
        state.recentOrders = action.payload;
      })
      .addCase(fetchRecentOrders.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteOrder.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteOrder.fulfilled, (state, action) => {
        state.deleting = false;
        const deletedId = action.payload;
        state.orders = state.orders.filter((order) => order._id !== deletedId);
        state.totalOrders = Math.max(0, state.totalOrders - 1);
      })
      .addCase(deleteOrder.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { setOrderFilters, resetOrderFilters } = orderSlice.actions;
export default orderSlice.reducer;
