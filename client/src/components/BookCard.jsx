import { 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box,
  Chip,
  IconButton,
  Tooltip,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import AddIcon from '@mui/icons-material/Add';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';

const StyledCard = styled(Card)({
  height: '500px',
  width:'20vw',
  maxWidth:'500px',
  minWidth:'320px',
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

const SaveButton = styled(Button)({
  background: '#000000',
  color: 'white',
  borderRadius: 8,
  textTransform: 'none',
  fontWeight: 600,
  '&:hover': {
    background: '#2c67f2',
  },
});

const BookCard = ({ book, onSave, isSaved, showSaveButton = true }) => {
  const truncateText = (text, maxLength) => {
    if (!text) return 'No description available';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  return (
    <StyledCard >
      <CardMedia
        component="img"
        height="200"
        image={book.thumbnail || 'https://via.placeholder.com/150x200?text=No+Image'}
        alt={book.title}
        sx={{ objectFit: 'contain', bgcolor: '#f9f9f9', p: 1  }}
      />
      <CardContent sx={{ flexGrow: 1, pb: 8 }}>
        <Typography gutterBottom variant="h6" component="h2" noWrap fontWeight={600}>
          {book.title}
        </Typography>
        {book.subtitle && (
          <Typography variant="body2" color="text.secondary" noWrap>
            {book.subtitle}
          </Typography>
        )}
        <Typography variant="body2" sx={{ mt: 1, mb: 1, color: '#2c67f2', fontWeight: 600 }}>
          {book.authors?.join(', ') || 'Unknown Author'}
        </Typography>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
          {truncateText(book.description, 80)}
        </Typography>
        
        {book.status && (
          <Chip 
            label={book.status} 
            size="small" 
            sx={{ 
              mb: 1, 
              bgcolor: '#2c67f2', 
              color: 'white',
              fontWeight: 600,
            }}
          />
        )}

        <Box sx={{
          position: 'absolute',
          bottom: 12,
          left: 12,
          right: 12,
          display: 'flex',
          gap: 1,
        }}>
          {book.infoLink && (
            <Tooltip title="View on Google Books">
              <IconButton 
                size="small" 
                sx={{ color: '#2c67f2' }}
                onClick={() => window.open(book.infoLink, '_blank')}
              >
                <OpenInNewIcon />
              </IconButton>
            </Tooltip>
          )}
          
          {showSaveButton && !isSaved && (
            <SaveButton
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={() => onSave(book)}
              sx={{ flexGrow: 1 }}
            >
              Save to Library
            </SaveButton>
          )}

          {isSaved && (
            <Button
              variant="outlined"
              startIcon={<CheckCircleIcon />}
              size="small"
              disabled
              sx={{ 
                borderColor: '#2c67f2',
                color: '#2c67f2',
                borderRadius: 2,
                flexGrow: 1,
              }}
            >
              In Library
            </Button>
          )}
        </Box>
      </CardContent>
    </StyledCard>
  );
};

export default BookCard;
