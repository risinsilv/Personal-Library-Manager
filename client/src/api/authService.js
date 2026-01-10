import api from './axios';

/**
 * Authentication Service
 * Handles user signup, login, and logout
 */

// User signup
export const signup = async (userData) => {
  const response = await api.post('/auth/signup', userData);
  
  // Store token and user data if signup is successful
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// User login
export const login = async (credentials) => {
  const response = await api.post('/auth/login', credentials);
  
  // Store token and user data if login is successful
  if (response.data.token) {
    localStorage.setItem('token', response.data.token);
    localStorage.setItem('user', JSON.stringify(response.data.user));
  }
  
  return response.data;
};

// User logout
export const logout = () => {
  // Clear token and user data from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
};

// Get current user from localStorage
export const getCurrentUser = () => {
  const user = localStorage.getItem('user');
  return user ? JSON.parse(user) : null;
};

// Check if user is authenticated
export const isAuthenticated = () => {
  return !!localStorage.getItem('token');
};
