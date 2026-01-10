import axios from 'axios';

/**
 * Google Books API Service
 * Handles searching for books using the Google Books API
 * Note: This uses a separate axios instance (not our authenticated api)
 * since Google Books API doesn't require our JWT token
 */

const GOOGLE_BOOKS_API = 'https://www.googleapis.com/books/v1/volumes';
const API_KEY = import.meta.env.VITE_GOOGLE_BOOKS_API_KEY || '';

/**
 * Search for books on Google Books API
 * @param {string} query - Search query (title, author, keyword)
 * @param {number} startIndex - Starting index for pagination (default: 0)
 * @param {number} maxResults - Number of results to return (default: 20)
 * @param {object} filters - Optional filters (printType, filter)
 * @returns {Promise} - Search results from Google Books API
 */
export const searchBooks = async (query, startIndex = 0, maxResults = 20, filters = {}) => {
  try {
    // Build query with optional field scoping (intitle, inauthor, etc.)
    const scopePrefix = filters.searchField === 'title'
      ? 'intitle:'
      : filters.searchField === 'author'
      ? 'inauthor:'
      : '';

    const params = {
      q: scopePrefix ? `${scopePrefix}${query}` : query,
      startIndex,
      maxResults,
      key: API_KEY,
    };

    // Add optional filters
    if (filters.printType) {
      params.printType = filters.printType; // 'all', 'books', 'magazines'
    }

    if (filters.filter) {
      params.filter = filters.filter; // 'free-ebooks', 'paid-ebooks', 'ebooks'
    }

    if (filters.orderBy) {
      params.orderBy = filters.orderBy; // 'relevance' | 'newest'
    }

    if (filters.langRestrict) {
      params.langRestrict = filters.langRestrict; // e.g. 'en', 'es', 'fr'
    }

    const response = await axios.get(GOOGLE_BOOKS_API, { params });
    return response.data;
  } catch (error) {
    console.error('Error searching books:', error);
    throw new Error('Failed to search books. Please try again.');
  }
};

/**
 * Get a single book by Google Books ID
 * @param {string} bookId - Google Books ID
 * @returns {Promise} - Book details
 */
export const getBookByGoogleId = async (bookId) => {
  try {
    const params = API_KEY ? { key: API_KEY } : {};
    const response = await axios.get(`${GOOGLE_BOOKS_API}/${bookId}`, { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching book details:', error);
    throw new Error('Failed to fetch book details. Please try again.');
  }
};

/**
 * Format book data from Google Books API for consistent use in the app
 * @param {object} book - Raw book data from Google Books API
 * @returns {object} - Formatted book data
 */
export const formatBookData = (book) => {
  const volumeInfo = book.volumeInfo || {};
  const imageLinks = volumeInfo.imageLinks || {};
  
  return {
    googleBooksId: book.id,
    title: volumeInfo.title || 'Unknown Title',
    subtitle: volumeInfo.subtitle || '',
    authors: volumeInfo.authors || ['Unknown Author'],
    description: volumeInfo.description || 'No description available.',
    thumbnail: imageLinks.thumbnail || imageLinks.smallThumbnail || '',
    previewLink: volumeInfo.previewLink || '',
    infoLink: volumeInfo.infoLink || '',
    publishedDate: volumeInfo.publishedDate || '',
    pageCount: volumeInfo.pageCount || 0,
    categories: volumeInfo.categories || [],
    averageRating: volumeInfo.averageRating || 0,
    ratingsCount: volumeInfo.ratingsCount || 0,
  };
};
