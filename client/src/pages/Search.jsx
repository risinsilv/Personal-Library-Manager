import { useState, useEffect, useRef } from 'react';
import {
  Container,
  TextField,
  Button,
  Grid,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Paper,
  InputAdornment,
  MenuItem,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { searchBooks, formatBookData, saveBook } from '../api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import BookCard from '../components/BookCard';
import SearchBackground from '../assets/SearchBackground.jpg';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#000000',
  },
  '& .MuiOutlinedInput-input': {
    color: theme.palette.mode === 'light' ? '#000000' : '#ffffff',
    '::placeholder': {
      color: theme.palette.mode === 'light' ? 'rgba(0,0,0,0.6)' : 'rgba(255,255,255,0.7)',
      opacity: 1,
    },
  },
  '& .MuiInputLabel-root': {
    color: theme.palette.mode === 'light' ? '#000000' : '#ffffff',
  },
  '& .MuiOutlinedInput-notchedOutline': {
    borderColor: theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.23)' : '#ffffff',
  },
  '& .MuiOutlinedInput-root:hover .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2c67f2',
  },
  '& .MuiOutlinedInput-root.Mui-focused .MuiOutlinedInput-notchedOutline': {
    borderColor: '#2c67f2',
    borderWidth: 2,
  },
}));

const SearchButton = styled(Button)(({ theme }) => ({
  background: '#000000',
  borderRadius: theme.spacing(1.5),
  boxShadow: 'none',
  color: 'white',
  height: 56,
  minWidth: 120,
  fontWeight: 600,
  
  textTransform: 'none',
  '&:hover': {
    background: '#2c67f2',
    boxShadow: 'none',
  },
  '&:disabled': {
    background: '#cccccc',
    color: '#666666',
  },
}));

const Search = () => {
  const [query, setQuery] = useState('');
  const [books, setBooks] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [savedBooks, setSavedBooks] = useState([]);
  const [printType, setPrintType] = useState('all');
  const [ebookFilter, setEbookFilter] = useState(''); // '', 'free-ebooks', 'paid-ebooks', 'ebooks'
  const [searchField, setSearchField] = useState('keywords'); // 'keywords' | 'title' | 'author'
  const [startIndex, setStartIndex] = useState(0);
  const [hasMore, setHasMore] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const sentinelRef = useRef(null);
  const observerRef = useRef(null);
  const { isAuthenticated } = useAuth();
  const { mode } = useTheme();

  const MAX_RESULTS = 20;

  const handleSearch = async (e) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    setError('');

    try {
      const data = await searchBooks(query, 0, MAX_RESULTS, {
        printType,
        filter: ebookFilter || undefined,
        searchField,
      });
      const formattedBooks = data.items?.map(formatBookData) || [];
      setBooks(formattedBooks);
      setStartIndex(0);
      const total = data.totalItems || 0;
      setHasMore(formattedBooks.length > 0 && formattedBooks.length < total);
      
      if (formattedBooks.length === 0) {
        setError('No books found. Try a different search term.');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore || !hasMore || !query.trim()) return;
    setLoadingMore(true);
    try {
      const nextIndex = startIndex + MAX_RESULTS;
      const data = await searchBooks(query, nextIndex, MAX_RESULTS, {
        printType,
        filter: ebookFilter || undefined,
        searchField,
      });
      const newItems = data.items?.map(formatBookData) || [];
      setBooks((prev) => {
        const existingIds = new Set(prev.map((b) => b.googleBooksId));
        const merged = [...prev];
        newItems.forEach((b) => {
          if (!existingIds.has(b.googleBooksId)) merged.push(b);
        });
        return merged;
      });
      setStartIndex(nextIndex);
      const total = data.totalItems || 0;
      setHasMore(nextIndex + newItems.length < total);
    } catch (err) {
      // Keep errors simple and non-blocking for infinite scroll
      setHasMore(false);
    } finally {
      setLoadingMore(false);
    }
  };

  useEffect(() => {
    if (!sentinelRef.current) return;
    if (observerRef.current) observerRef.current.disconnect();
    observerRef.current = new IntersectionObserver(
      (entries) => {
        const first = entries[0];
        if (first.isIntersecting) {
          loadMore();
        }
      },
      { rootMargin: '200px' }
    );
    observerRef.current.observe(sentinelRef.current);
    return () => observerRef.current && observerRef.current.disconnect();
  }, [hasMore, loadingMore, query, books.length]);

  const handleSaveBook = async (book) => {
    if (!isAuthenticated) {
      setError('Please login to save books');
      return;
    }

    try {
      await saveBook(book);
      setSavedBooks([...savedBooks, book.googleBooksId]);
      setError('');
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save book');
    }
  };

  return (
    <Box sx={{ bgcolor: 'white', minHeight: 'calc(100vh - 64px)', backgroundColor: mode === 'light' ? '#f5f5f5' : '#121212' }}>
      {/* Search Section with Background */}
      <Box
        sx={{
          backgroundImage: `url(${SearchBackground})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          py: { xs: 6, sm: 8, md: 10 },
          display: 'flex',
          justifyContent: 'center',
          px: { xs: 2, sm: 0 },
        }}
      >
        <Container sx={{
          width: { xs: '90vw', sm: '70vw', md: '60vw' },
          maxWidth: { xs: 380, sm: 500, md: 900 },
          minWidth: { xs: 280, sm: 360, md: 480 }
        }}>
          <Paper 
            elevation={0} 
            sx={{ 
              p: { xs: 2, sm: 3, md: 4 }, 
              borderRadius: 3, 
              backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.95)' : 'rgba(18, 18, 18, 0.95)',
              border: 'none',
            }}
          >
            <Typography variant="h4" gutterBottom fontWeight={600} sx={{ fontSize: { xs: '0.9rem', sm: '1.75rem', md: '2rem' } }}>
              Search Books
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 3, fontSize: { xs: '0.8rem', sm: '1rem', md: '1.125rem' } }}>
              Search for books by title, author, or keyword
            </Typography>

            {/* Filters */}
            <Box sx={{ display: 'flex', gap: 2, mb: 2, flexWrap: 'wrap', width: '100%' }}>
              <StyledTextField
                select
                label="Search In"
                value={searchField}
                onChange={(e) => setSearchField(e.target.value)}
                sx={{ minWidth: { xs: '100%', sm: 160 } }}
              >
                <MenuItem value="keywords">Keywords</MenuItem>
                <MenuItem value="title">Title</MenuItem>
                <MenuItem value="author">Author</MenuItem>
              </StyledTextField>

              <StyledTextField
                select
                label="Print Type"
                value={printType}
                onChange={(e) => setPrintType(e.target.value)}
                sx={{ minWidth: { xs: '100%', sm: 160 }}}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="books">Books</MenuItem>
                <MenuItem value="magazines">Magazines</MenuItem>
              </StyledTextField>

              <StyledTextField
                select
                label="Filter"
                value={ebookFilter}
                onChange={(e) => setEbookFilter(e.target.value)}
                sx={{ minWidth: { xs: '100%', sm: 160 }}}
                >
                <MenuItem value="">None</MenuItem>
                <MenuItem value="free-ebooks">Free E-books</MenuItem>
                <MenuItem value="paid-ebooks">Paid E-books</MenuItem>
                <MenuItem value="ebooks">E-books</MenuItem>
              </StyledTextField>
            </Box>

            <form onSubmit={handleSearch}>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap', width: '100%' }}>
                <StyledTextField
                  fullWidth
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="Enter book title, author, or keyword..."
                  
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <SearchIcon sx={{ color: '#2c67f2' }} />
                      </InputAdornment>
                    ),
                  }}
                />
                <SearchButton
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={loading}
                  sx={{
                    backgroundColor: mode === 'light' ? '#000000' : 'white',
                    color: mode === 'light' ? 'white' : 'black',
                    width: { xs: '100%', sm: 'auto' },
                    minWidth: { sm: 100 },
                    height: { xs: 48, sm: 56 }
                  }}
                >
                  {loading ? <CircularProgress size={24} color="inherit" /> : 'Search'}
                </SearchButton>
              </Box>
            </form>

            {error && (
              <Alert 
                severity={error.includes('login') ? 'warning' : 'info'} 
                sx={{ mt: 2, borderRadius: 2 }}
              >
                {error}
              </Alert>
            )}
          </Paper>
        </Container>
      </Box>

      {/* Results Section */}
      <Container maxWidth={false} sx={{ py: 4, width: { xs: '90vw', sm: '85vw', md: '80vw' }, minWidth: { xs: 280, sm: 360 }, px: { xs: 2, sm: 0 } }} >

        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 8,  }}>
            <CircularProgress size={60} />
          </Box>
        ) : (
          <Grid container spacing={3} sx={{ justifyContent: 'center', display:'flex',flexWrap:'wrap' }}>
            {books.map((book) => (
              <Grid item xs={12} sm={6} md={4} lg={3} key={book.googleBooksId}>
                <BookCard
                  book={book}
                  onSave={handleSaveBook}
                  isSaved={savedBooks.includes(book.googleBooksId)}
                  showSaveButton={isAuthenticated}
                />
              </Grid>
            ))}
            {/* Sentinel for infinite scroll */}
            {hasMore && (
              <Grid item xs={12}>
                <Box ref={sentinelRef} sx={{ height: 1 }} />
              </Grid>
            )}
          </Grid>
        )}

        {books.length === 0 && !loading && (
          <Box sx={{ textAlign: 'center', py: 8 }}>
            <Typography variant="h6" color="text.secondary">
              Search for books to get started
            </Typography>
          </Box>
        )}

        {loadingMore && (
          <Box sx={{ display: 'flex', justifyContent: 'center', py: 3 }}>
            <CircularProgress size={32} />
          </Box>
        )}
      </Container>
    </Box>
  );
};

export default Search;
