const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  googleBooksId: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  subtitle: String,
  authors: [String],
  description: String,
  thumbnail: String,
  previewLink: String,
  infoLink: String,
  publishedDate: String,
  pageCount: Number,
  categories: [String],
  // User's personal data
  status: {
    type: String,
    enum: ['Want to Read', 'Reading', 'Completed'],
    default: 'Want to Read',
  },
  personalReview: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Compound index to prevent duplicate books per user
bookSchema.index({ user: 1, googleBooksId: 1 }, { unique: true });

module.exports = mongoose.model('Book', bookSchema);
