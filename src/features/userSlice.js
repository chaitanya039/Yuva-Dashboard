import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../api/axiosInstance";

// Inline reusable GET thunk helper
const createGetThunk = (name, endpoint) =>
  createAsyncThunk(name, async (params = {}, thunkAPI) => {
    try {
      const query = new URLSearchParams(params).toString();
      const res = await api.get(query ? `${endpoint}?${query}` : endpoint);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || `Failed to fetch ${name}`
      );
    }
  });

// 🚀 THUNKS
export const fetchUsers = createGetThunk("users/fetchUsers", "/users");
export const fetchRoles = createGetThunk("users/fetchRoles", "/users/roles"); // ✅

export const getUserById = createAsyncThunk(
  "users/getUserById",
  async (id, thunkAPI) => {
    try {
      const res = await api.get(`/users/${id}`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to fetch user"
      );
    }
  }
);

export const createUser = createAsyncThunk(
  "users/createUser",
  async (formData, thunkAPI) => {
    try {
      const res = await api.post("/users", formData);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to create user"
      );
    }
  }
);

export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, formData }, thunkAPI) => {
    try {
      const res = await api.put(`/users/${id}`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to update user"
      );
    }
  }
);

export const deleteUser = createAsyncThunk(
  "users/deleteUser",
  async (id, thunkAPI) => {
    try {
      await api.delete(`/users/${id}`);
      return id;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to delete user"
      );
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  "users/toggleUserStatus",
  async (id, thunkAPI) => {
    try {
      const res = await api.patch(`/users/${id}/status`);
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(
        err.response?.data?.message || "Failed to toggle user status"
      );
    }
  }
);

// ============================
// 📦 USERS SLICE
// ============================

const userSlice = createSlice({
  name: "users",
  initialState: {
    loading: false,
    error: null,
    list: [],
    roles: [], // ✅ for select options
    selectedUser: null,
  },
  reducers: {},
  extraReducers: (builder) => {
    const handleAsync = (thunk, key) => {
      builder
        .addCase(thunk.pending, (state) => {
          state.loading = true;
          state.error = null;
        })
        .addCase(thunk.fulfilled, (state, action) => {
          state.loading = false;
          state[key] = action.payload;
        })
        .addCase(thunk.rejected, (state, action) => {
          state.loading = false;
          state.error = action.payload;
        });
    };

    handleAsync(fetchUsers, "list");
    handleAsync(getUserById, "selectedUser");
    handleAsync(fetchRoles, "roles"); // ✅

    builder
      .addCase(createUser.fulfilled, (state, action) => {
        state.list.push(action.payload);
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      })
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.list = state.list.filter((u) => u._id !== action.payload);
      })
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const index = state.list.findIndex((u) => u._id === action.payload._id);
        if (index !== -1) state.list[index] = action.payload;
      });
  },
});

export default userSlice.reducer;
