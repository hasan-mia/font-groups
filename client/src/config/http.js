import axios from 'axios';

// Create an axios instance
const http = axios.create({
  baseURL: process.env.REACT_APP_API_URL,
  timeout: 5000,
});

// Add request interceptor
http.interceptors.request.use(
  function (config) {
    if (typeof window === 'undefined') {
      return config;
    }

    // Retrieve token from localStorage
    const token = localStorage.getItem('token');
    if (token) {
      // Set Authorization header if token exists
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  function (error) {
    // Handle request error
    return Promise.reject(error);
  }
);

// Export the axios instance
export { http };
