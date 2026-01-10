const express = require('express');
const router = express.Router();
const authMiddleware = require('../middleware/auth');
const {
  getBooks,
  getBookById,
  saveBook,
  updateBook,
  deleteBook,
} = require('../controllers/bookController');

// All routes are protected
router.use(authMiddleware);

// GET /api/books - Get all books for user
router.get('/', getBooks);

// GET /api/books/:id - Get single book
router.get('/:id', getBookById);

// POST /api/books - Save a book
router.post('/', saveBook);

// PUT /api/books/:id - Update a book
router.put('/:id', updateBook);

// DELETE /api/books/:id - Delete a book
router.delete('/:id', deleteBook);

module.exports = router;
