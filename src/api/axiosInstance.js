import axios from 'axios';

// Detect environment
const isProduction = import.meta.env.MODE === 'production';

// Set base URL conditionally
const baseURL = isProduction
  ? import.meta.env.VITE_API_BASE_URL
  : 'http://localhost:5000/api/v1';

const api = axios.create({
  baseURL,
  withCredentials: true,  // Ensure cookies are sent with requests
});

// Intercept each request
api.interceptors.request.use(
  (config) => {
    // If you're using cookies for the token, you don't need to set Authorization manually
    // Cookies will automatically be sent with requests due to 'withCredentials: true'
    
    return config;
  },
  (error) => Promise.reject(error)
);

// Global response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Handle 401 Unauthorized (Token Expired or Invalid)
    if (error.response?.status === 401) {
      console.warn('Unauthorized. Clearing token...');

      // Clear cookies on Unauthorized (if needed)
      document.cookie = 'user_token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';  // This removes the cookie

      // Optionally, redirect the user to the login page
      // window.location.href = '/login'; // or use your navigation method if in React

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
