import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// 🔹 Fetch all customers (with filters)
export const fetchCustomers = createAsyncThunk(
  "customers/fetchAll",
  async (params, thunkAPI) => {
    try {
      const res = await api.get("/customers", { params });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch customers"
      );
    }
  }
);

// 🔹 Create new customer
export const createCustomer = createAsyncThunk(
  "customers/create",
  async (data, thunkAPI) => {
    try {

      const res = await api.post("/customers", data, {
        headers: {
          "Content-Type": "multipart/form-data",  // For image upload
        },
      });

      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create customer"
      );
    }
  }
);

// 🔹 Update customer
export const updateCustomer = createAsyncThunk(
  "customers/update",
  async ({ id, data }, thunkAPI) => {

    try {
      const res = await api.put(`/customers/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",  // For image upload
        },
      });

      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update customer"
      );
    }
  }
);

// 🔹 Delete customer
export const deleteCustomer = createAsyncThunk(
  "customers/delete",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/customers/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete customer"
      );
    }
  }
);

const customerSlice = createSlice({
  name: "customers",
  initialState: {
    customers: [],
    total: 0,
    loading: false,
    creating: false,
    updating: false,
    deleting: false,
    error: null,
    currentPage: 1,
    filters: {
      page: 1,
      limit: 10,
      search: "",
      type: "", // Retailer or Wholesaler
    },
  },
  reducers: {
    setCustomerFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    resetCustomerFilters: (state) => {
      state.filters = {
        page: 1,
        limit: 10,
        search: "",
        type: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchCustomers.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCustomers.fulfilled, (state, action) => {
        state.loading = false;
        state.customers = action.payload.customers;
        state.total = action.payload.total;
      })
      .addCase(fetchCustomers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create
      .addCase(createCustomer.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createCustomer.fulfilled, (state, action) => {
        state.creating = false;
        state.customers.unshift(action.payload);
      })
      .addCase(createCustomer.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // Update
      .addCase(updateCustomer.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateCustomer.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.customers.findIndex(
          (c) => c._id === action.payload._id
        );
        if (index !== -1) {
          state.customers[index] = action.payload;
        }
      })
      .addCase(updateCustomer.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Delete
      .addCase(deleteCustomer.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteCustomer.fulfilled, (state, action) => {
        state.deleting = false;
        state.customers = state.customers.filter(
          (c) => c._id !== action.payload
        );
      })
      .addCase(deleteCustomer.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  },
});

export const { setCustomerFilters, resetCustomerFilters } = customerSlice.actions;

export default customerSlice.reducer;
