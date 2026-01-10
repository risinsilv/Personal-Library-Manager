const Book = require('../models/Book');

// Get all books for logged-in user
exports.getBooks = async (req, res) => {
  try {
    const books = await Book.find({ user: req.user.userId }).sort({ createdAt: -1 });
    res.json(books);
  } catch (error) {
    console.error('Get books error:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

// Get single book by ID
exports.getBookById = async (req, res) => {
  try {
    const book = await Book.findOne({ 
      _id: req.params.id, 
      user: req.user.userId 
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json(book);
  } catch (error) {
    console.error('Get book error:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
};

// Save a book to library
exports.saveBook = async (req, res) => {
  try {
    const bookData = {
      ...req.body,
      user: req.user.userId,
    };

    // Check if book already exists for this user
    const existingBook = await Book.findOne({
      user: req.user.userId,
      googleBooksId: bookData.googleBooksId,
    });

    if (existingBook) {
      return res.status(400).json({ message: 'Book already in your library' });
    }

    const book = new Book(bookData);
    await book.save();

    res.status(201).json({
      message: 'Book saved successfully',
      book,
    });
  } catch (error) {
    console.error('Save book error:', error);
    res.status(500).json({ message: 'Error saving book' });
  }
};

// Update a book (status, review)
exports.updateBook = async (req, res) => {
  try {
    const { status, personalReview } = req.body;

    const book = await Book.findOne({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    // Update fields if provided
    if (status !== undefined) book.status = status;
    if (personalReview !== undefined) book.personalReview = personalReview;

    await book.save();

    res.json({
      message: 'Book updated successfully',
      book,
    });
  } catch (error) {
    console.error('Update book error:', error);
    res.status(500).json({ message: 'Error updating book' });
  }
};

// Delete a book from library
exports.deleteBook = async (req, res) => {
  try {
    const book = await Book.findOneAndDelete({
      _id: req.params.id,
      user: req.user.userId,
    });

    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }

    res.json({ message: 'Book deleted successfully' });
  } catch (error) {
    console.error('Delete book error:', error);
    res.status(500).json({ message: 'Error deleting book' });
  }
};
