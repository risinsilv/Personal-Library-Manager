import api from './axios';

/**
 * Books Service
 * Handles all book-related operations (CRUD for personal library)
 */

// Get all saved books for the logged-in user
export const getSavedBooks = async () => {
  const response = await api.get('/books');
  return response.data;
};

// Save a book to the user's library
export const saveBook = async (bookData) => {
  const response = await api.post('/books', bookData);
  return response.data;
};

// Update a saved book (e.g., add review, change status)
export const updateBook = async (bookId, updateData) => {
  const response = await api.put(`/books/${bookId}`, updateData);
  return response.data;
};

// Delete a book from the user's library
export const deleteBook = async (bookId) => {
  const response = await api.delete(`/books/${bookId}`);
  return response.data;
};

// Get a single book by ID
export const getBookById = async (bookId) => {
  const response = await api.get(`/books/${bookId}`);
  return response.data;
};
