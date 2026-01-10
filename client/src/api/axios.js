import axios from 'axios';

// Create axios instance with base configuration
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Automatically attach JWT token to every request
api.interceptors.request.use(
  (config) => {
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // If token exists, attach it to Authorization header
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    // Handle request errors
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle global errors and token expiration
api.interceptors.response.use(
  (response) => {
    // Return successful responses as-is
    return response;
  },
  (error) => {
    // Simplified error handling aligned with backend responses
    const status = error.response?.status;
    const backendMessage = error.response?.data?.message;
    const url = error.config?.url || '';
    const isAuthRoute = url.includes('/auth/login') || url.includes('/auth/signup');

    // 401: clear auth and redirect to login with a concise message
    if (status === 401) {
      const hasToken = !!localStorage.getItem('token');
      // For login/signup or unauthenticated requests, surface backend message (e.g., Invalid credentials)
      if (isAuthRoute || !hasToken) {
        return Promise.reject(new Error(backendMessage || 'Invalid credentials'));
      }
      // For authenticated requests, treat as token expiry
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
      return Promise.reject(new Error('Please log in again.'));
    }

    // Prefer backend-provided message; fallback to a simple generic
    const message = backendMessage || 'Something went wrong. Please try again.';

    // Network errors (no response)
    if (error.request && !error.response) {
      return Promise.reject(new Error('Unable to reach the server. Check your connection.'));
    }

    return Promise.reject(new Error(message));
  }
);

export default api;
