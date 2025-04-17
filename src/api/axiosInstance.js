import axios from 'axios';

// Detect environment
const isProduction = import.meta.env.MODE === 'production';

// Set base URL conditionally
const baseURL = isProduction
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL,
  withCredentials: true,
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
