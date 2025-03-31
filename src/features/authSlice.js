// authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '../api/axiosInstance';

// ✅ Login SuperAdmin
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (data, thunkAPI) => {
    try {
      const res = await api.post('/auth/user/login', data, {
        withCredentials: true
      });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

// ✅ Load SuperAdmin (persistent login)
export const loadUser = createAsyncThunk(
  'auth/loadUser',
  async (_, thunkAPI) => {
    try {
      const res = await api.get('/auth/user/me', { withCredentials: true });
      return res.data.data;
    } catch (err) {
      return thunkAPI.rejectWithValue('Not authenticated');
    }
  }
);

// ✅ Logout
export const logout = createAsyncThunk('auth/logout', async () => {
  await api.post('/auth/user/logout');
});

const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: null,
    loading: false,
    error: null,
    isAuthenticated: false
  },
  reducers: {},
  extraReducers: builder => {
    builder
      // Login
      .addCase(loginUser.pending, state => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      })

      // Load User
      .addCase(loadUser.pending, state => {
        state.loading = true;
      })
      .addCase(loadUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(loadUser.rejected, state => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
      })

      // Logout
      .addCase(logout.fulfilled, state => {
        state.user = null;
        state.isAuthenticated = false;
      });
  }
});

export default authSlice.reducer;
