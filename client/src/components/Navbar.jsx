import { AppBar, Toolbar, Typography, Button, Box, IconButton } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import LogoutIcon from '@mui/icons-material/Logout';
import SearchIcon from '@mui/icons-material/Search';
import LibraryBooksIcon from '@mui/icons-material/LibraryBooks';
import LightModeIcon from '@mui/icons-material/LightMode';
import useMediaQuery from '@mui/material/useMediaQuery';

const Navbar = () => {
  const { isAuthenticated, logout, user } = useAuth();
  const { mode, toggleTheme } = useTheme();
  const navigate = useNavigate();

  return (
    <AppBar position="sticky" sx={{ backgroundColor: mode === 'light' ? 'white' : 'black', color: mode === 'light' ? 'black' : 'white' }}>
      <Toolbar sx={{ display: 'flex', alignItems: 'center', position: 'relative', px: { xs: 1, sm: 2 } }}>
        {/* Left: Brand */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, cursor: 'pointer' }} onClick={() => navigate('/')}> 
          <MenuBookIcon sx={{ color: '#2c67f2' }} />
          <Typography variant="h6" component="div">
            <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>
              Personal Library Manager
            </Box>
          </Typography>
        </Box>

        {/* Middle: Nav links (centered) */}
        <Box sx={{
          position: 'absolute',
          left: '50%',
          transform: 'translateX(-50%)',
          display: { xs: 'none', md: 'flex' },
          gap: 2,
          alignItems: 'center',
        }}>
          <Button 
            color="inherit"
            startIcon={<SearchIcon sx={{ fontSize: 22 }} />}
            onClick={() => navigate('/')}
            
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: 22, '&:hover': { color: '#2c67f2' } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>
              Search
            </Box>
          </Button>
          { isAuthenticated ? (
            <Button 
            color="inherit"
            startIcon={<LibraryBooksIcon sx={{ fontSize: 22 }} />}
            
            onClick={() => navigate('/library')}
            sx={{ textTransform: 'none', fontWeight: 600, fontSize: 20, '&:hover': { color: '#2c67f2' } }}
          >
            <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>
              My Library
            </Box>
          </Button>
          ): null}
        
        </Box>

        {/* Right: actions (theme, auth, user) */}
        <Box sx={{ display: 'flex', gap: { xs: 0.5, sm: 1, md: 2 }, alignItems: 'center', marginLeft: 'auto' }}>
          {/* Light icon instead of switch */}
          <IconButton color="inherit" onClick={toggleTheme} aria-label="toggle theme">
            <LightModeIcon sx={{ color: '#2c67f2' }} />
          </IconButton>

          {/* Compact nav icons on mobile to avoid overlap */}
          <IconButton
            color="inherit"
            onClick={() => navigate('/')}
            aria-label="go to search"
            sx={{ display: { xs: 'inline-flex', md: 'none' } }}
          >
            <SearchIcon />
          </IconButton>
          {isAuthenticated && (
            <IconButton
              color="inherit"
              onClick={() => navigate('/library')}
              aria-label="go to library"
              sx={{ display: { xs: 'inline-flex', md: 'none' } }}
            >
              <LibraryBooksIcon />
            </IconButton>
          )}

          {isAuthenticated ? (
            <>
              <Button 
                color="inherit" 
                startIcon={<LogoutIcon sx={{ fontSize: 20 }} />}
                onClick={logout}
                sx={{ textTransform: 'none', fontWeight: 600, fontSize: 14, '&:hover': { color: '#2c67f2' } }}
              >
                <Box component="span" sx={{ display: { xs: 'none', sm: 'none', md: 'inline' } }}>
                  Logout
                </Box>
              </Button>
              {/* Username at the far right (only when available) */}
              {user?.username && (
                <Typography variant="body1" sx={{ color: '#2c67f2', fontWeight: 600, fontSize: 14, display: { xs: 'none', sm: 'none', md: 'inline' } }}>
                  {user.username}
                </Typography>
              )}
            </>
          ) : (
            <Button 
              color="inherit" 
              onClick={() => navigate('/login')}
              sx={{ textTransform: 'none', fontWeight: 600, fontSize: 14, '&:hover': { color: '#2c67f2' } }}>
                Login
            </Button>
          )}
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
