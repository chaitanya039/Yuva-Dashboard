import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

export const fetchProducts = createAsyncThunk(
  "products/fetchProducts",
  async (filters = {}, thunkAPI) => {
    try {
      // Provide default values if filters is undefined/empty
      const {
        search = "",
        category = "",
        stockStatus = "",
        page = 1,
        limit = 10,
      } = filters;

      const params = new URLSearchParams();

      if (search) params.append("search", search);
      if (category) params.append("category", category);
      if (stockStatus) params.append("stockStatus", stockStatus);
      params.append("page", page);
      params.append("limit", limit);

      const res = await api.get(`/products?${params.toString()}`);

      return {
        products: res.data.data?.products || [],
        total: res.data.data?.total || 0,
        page: parseInt(page),
      };
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch products"
      );
    }
  }
);

// Create new product (with image)
export const createProduct = createAsyncThunk(
  "products/createProduct",
  async (formData, thunkAPI) => {
    try {
      console.log(formData);
      const res = await api.post("/products", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create product"
      );
    }
  }
);

// Update product
export const updateProduct = createAsyncThunk(
  "products/updateProduct",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/products/${id}`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update product"
      );
    }
  }
);

// Delete product
export const deleteProduct = createAsyncThunk(
  "products/deleteProduct",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/products/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete product"
      );
    }
  }
);

// 🔹 Fetch Products by Customer ID (for Order creation)
export const fetchProductsByCustomer = createAsyncThunk(
  "products/fetchByCustomer",
  async (customerId, thunkAPI) => {
    try {
      const res = await api.get(`/products/by-customer/${customerId}`);
      return res.data.data; // This should be an array of adjusted products
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message ||
          "Failed to fetch customer-specific products"
      );
    }
  }
);

const productSlice = createSlice({
  name: "products",
  initialState: {
    products: [],
    totalProducts: 0,
    currentPage: 1,
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    filteredProducts: [],
    loadingFiltered: false,
    filters: {
      // Add default filters
      search: "",
      category: "",
      stockStatus: "",
      page: 1,
      limit: 10,
    },
  },
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
    setFilters: (state, action) => {
      state.filters = {
        ...state.filters,
        ...action.payload,
      };
    },
    resetFilters: (state) => {
      state.filters = {
        search: "",
        category: "",
        stockStatus: "",
      };
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Products
      .addCase(fetchProducts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products || [];
        state.totalProducts = action.payload.total || 0;
        state.currentPage = action.payload.page || 1;
      })
      .addCase(fetchProducts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Create Product
      .addCase(createProduct.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createProduct.fulfilled, (state, action) => {
        state.creating = false;
        state.products.unshift(action.payload); // Add new product at the beginning
        state.totalProducts += 1;
      })
      .addCase(createProduct.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })

      // Update Product
      .addCase(updateProduct.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateProduct.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.products.findIndex(
          (p) => p._id === action.payload._id
        );
        if (index !== -1) {
          state.products[index] = action.payload;
        }
      })
      .addCase(updateProduct.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })

      // Delete Product
      .addCase(deleteProduct.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteProduct.fulfilled, (state, action) => {
        state.deleting = false;
        state.products = state.products.filter((p) => p._id !== action.payload);
        state.totalProducts = Math.max(0, state.totalProducts - 1);
      })
      .addCase(deleteProduct.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      })

      // 🔹 Handle fetchProductsByCustomer
      .addCase(fetchProductsByCustomer.pending, (state) => {
        state.loadingFiltered = true;
        state.error = null;
      })
      .addCase(fetchProductsByCustomer.fulfilled, (state, action) => {
        state.loadingFiltered = false;
        state.filteredProducts = action.payload;
      })
      .addCase(fetchProductsByCustomer.rejected, (state, action) => {
        state.loadingFiltered = false;
        state.error = action.payload;
      });
  },
});

export const { clearError, setFilters, resetFilters } = productSlice.actions;

export default productSlice.reducer;
