/**
 * Central export point for all API services
 * Import all services from this file for cleaner imports
 */

// Export all auth services
export {
  signup,
  login,
  logout,
  getCurrentUser,
  isAuthenticated,
} from './authService';

// Export all books services
export {
  getSavedBooks,
  saveBook,
  updateBook,
  deleteBook,
  getBookById,
} from './booksService';

// Export all Google Books services
export {
  searchBooks,
  getBookByGoogleId,
  formatBookData,
} from './googleBooksService';

// Export axios instance for custom requests if needed
export { default as api } from './axios';
