import axios from 'axios';

// Base setup
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api/v1',
  withCredentials: true, // ✅ important for cookie-based auth
});

// Intercept each request
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`; // ✅ Token-based fallback
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Optional: Global response error handler (e.g., token expired, unauthorized)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn('Unauthorized. Clearing token...');
      localStorage.removeItem('token');
      // Optional: redirect to login
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;
