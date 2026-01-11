import { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Card,
  CardContent,
  CardMedia,
  Button,
  Select,
  MenuItem,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  IconButton,
  Chip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import { useTheme } from '../context/ThemeContext';
import { getSavedBooks, deleteBook, updateBook } from '../api';

const StyledCard = styled(Card)({
  height: '500px',
  width:'20vw',
  maxWidth:'500px',
  minWidth:'350px',
  display: 'flex',
  flexDirection: 'column',
  position: 'relative',
  border: 'none',
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  borderRadius: 12,
  transition: 'transform 0.2s, box-shadow 0.2s',
  '&:hover': {
    transform: 'translateY(-4px)',
    boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
  },
});

const ActionButton = styled(Button)({
  background: '#000000',
  color: 'white',
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: '#2c67f2',
  },
});

// Map book status to chip colors
const getStatusStyle = (status) => {
  switch (status) {
    case 'Want to Read':
      return { bgcolor: '#9e9e9e', color: 'white' }; // Grey
    case 'Reading':
      return { bgcolor: '#2c67f2', color: 'white' }; // Primary blue
    case 'Completed':
      return { bgcolor: '#4caf50', color: 'white' }; // Green
    default:
      return { bgcolor: '#9e9e9e', color: 'white' }; // Fallback
  }
};

const Library = () => {
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editDialog, setEditDialog] = useState({ open: false, book: null });
  const [editData, setEditData] = useState({ status: '', personalReview: '' });
const { mode } = useTheme();
  useEffect(() => {
    fetchBooks();
  }, []);

  const fetchBooks = async () => {
    try {
      const data = await getSavedBooks();
      setBooks(data);
    } catch (err) {
      setError('Failed to load your library');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (bookId) => {
    if (!window.confirm('Are you sure you want to remove this book?')) return;

    try {
      await deleteBook(bookId);
      setBooks(books.filter((book) => book._id !== bookId));
    } catch (err) {
      setError('Failed to delete book');
    }
  };

  const handleEditOpen = (book) => {
    setEditData({
      status: book.status,
      personalReview: book.personalReview || '',
    });
    setEditDialog({ open: true, book });
  };

  const handleEditClose = () => {
    setEditDialog({ open: false, book: null });
  };

  const handleEditSave = async () => {
    try {
      const updated = await updateBook(editDialog.book._id, editData);
      setBooks(books.map((book) => (book._id === updated.book._id ? updated.book : book)));
      handleEditClose();
    } catch (err) {
      setError('Failed to update book');
    }
  };

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', py: 8 }}>
        <CircularProgress size={60} />
      </Box>
    );
  }

  return (
    <Box sx={{ bgcolor: mode === 'dark' ? '#121212' : 'white', minHeight: 'calc(100vh - 64px)', py: 4 }}>
      <Container maxWidth="100vw">
        <Typography variant="h4" gutterBottom fontWeight={600}>
          My Library
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          {books.length} {books.length === 1 ? 'book' : 'books'} in your collection
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 3, borderRadius: 2 }} onClose={() => setError('')}>
            {error}
          </Alert>
        )}

        {books.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Your library is empty. Start by searching for books!
            </Typography>
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ justifyContent: 'center', display:'flex',flexWrap:'wrap' }}>
            {books.map((book) => (
              
                <StyledCard>
                  <CardMedia
                    component="img"
                    height="200"
                    image={book.thumbnail || 'https://via.placeholder.com/150x200?text=No+Image'}
                    alt={book.title}
                    sx={{ objectFit: 'contain', bgcolor: '#f9f9f9', p: 1 }}
                  />
                  <CardContent sx={{ flexGrow: 1 }}>
                    <Typography variant="h6" noWrap gutterBottom fontWeight={600}>
                      {book.title}
                    </Typography>
                    <Typography variant="body2" sx={{ color: '#2c67f2', fontWeight: 600 }} gutterBottom>
                      {book.authors?.join(', ')}
                    </Typography>
                    <Chip
                      label={book.status}
                      size="small"
                      sx={{ 
                        mb: 1,
                        fontWeight: 600,
                        ...getStatusStyle(book.status),
                      }}
                    />

                    {book.personalReview && (
                      <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                        "{book.personalReview.substring(0, 50)}
                        {book.personalReview.length > 50 ? '...' : ''}"
                      </Typography>
                    )}

                    <Box sx={{
                        position: 'absolute',
                        bottom: 12,
                        left: 12,
                        right: 12,
                        display: 'flex',
                        gap: 1,
                        mt: 2 }}>
                      <IconButton
                        size="small"
                        sx={{ color: '#2c67f2' }}
                        onClick={() => handleEditOpen(book)}
                      >
                        <EditIcon />
                      </IconButton>
                      {book.infoLink && (
                        <IconButton
                          size="small"
                          sx={{ color: '#2c67f2' }}
                          onClick={() => window.open(book.infoLink, '_blank')}
                        >
                          <OpenInNewIcon />
                        </IconButton>
                      )}
                      <IconButton
                        size="small"
                        sx={{ color: '#000000' }}
                        onClick={() => handleDelete(book._id)}
                      >
                        <DeleteIcon />
                      </IconButton>
                    </Box>
                  </CardContent>
                </StyledCard>
              
            ))}
          </Grid>
        )}

        {/* Edit Dialog */}
        <Dialog open={editDialog.open} onClose={handleEditClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ fontWeight: 600 }}>Edit Book</DialogTitle>
          <DialogContent>
            <Box sx={{ pt: 2 }}>
              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Status
              </Typography>
              <Select
                fullWidth
                value={editData.status}
                onChange={(e) => setEditData({ ...editData, status: e.target.value })}
                sx={{ mb: 2, borderRadius: 2 }}
              >
                <MenuItem value="Want to Read">Want to Read</MenuItem>
                <MenuItem value="Reading">Reading</MenuItem>
                <MenuItem value="Completed">Completed</MenuItem>
              </Select>

              <Typography variant="subtitle2" gutterBottom fontWeight={600}>
                Personal Review
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={4}
                value={editData.personalReview}
                onChange={(e) => setEditData({ ...editData, personalReview: e.target.value })}
                placeholder="Write your thoughts about this book..."
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: 2,
                  }
                }}
              />
            </Box>
          </DialogContent>
          <DialogActions sx={{ p: 2 }}>
            <Button onClick={handleEditClose} sx={{ color: '#666' }}>
              Cancel
            </Button>
            <ActionButton onClick={handleEditSave} variant="contained">
              Save
            </ActionButton>
          </DialogActions>
        </Dialog>
      </Container>
    </Box>
  );
};

export default Library;
