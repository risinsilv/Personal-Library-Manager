import { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Container,
  Paper,
  TextField,
  Button,
  Typography,
  Box,
  Alert,
  Link,
  colors,
} from '@mui/material';
import { login as loginService, signup as signupService } from '../api';
import { styled } from '@mui/material/styles';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoginBackground from '../assets/LoginBackground.jpg';

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.spacing(1.5),
    backgroundColor: theme.palette.mode === 'light' ? '#ffffff' : '#00000',
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

const GradientButton = styled(Button)(({ theme }) => ({
  background: '#4285F4',
  border: 0,
  borderRadius: theme.spacing(1.5),
  boxShadow: 'none',
  color: 'white',
  height: 58,
  padding: '0 30px',
  fontSize: '1rem',
  fontWeight: 600,
  textTransform: 'none',
  transition: 'background 0.2s ease',
  '&:hover': {
    background: '#000000',
    boxShadow: 'none',
  },
  '&:active': {
    background: '#000000',
    boxShadow: 'none',
  },
  // Make the press ripple white
  '& .MuiTouchRipple-child': {
    backgroundColor: '#ffffff',
  },
}));

const Login = () => {
  const location = useLocation();
  const isSignup = location.pathname === '/signup';
  const { mode } = useTheme();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!isSignup) {
        // Login
        const data = await loginService({
          email: formData.email,
          password: formData.password,
        });
        login(data.user);
        navigate('/');
      } else {
        // Signup
        if (formData.password !== formData.confirmPassword) {
          setError('Passwords do not match');
          setLoading(false);
          return;
        }

        const data = await signupService({
          username: formData.username,
          email: formData.email,
          password: formData.password,
        });
        login(data.user);
        navigate('/');
      }
    } catch (err) {
      setError(err.response?.data?.message || err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      sx={{
       height: 'calc(100vh - 64px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundImage: `url(${LoginBackground})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        overflow: 'hidden',
        px: { xs: 2, sm: 0 },
      }}
    >
      <Container sx={{
        minWidth: 280,
        width: { xs: '92vw', sm: '80vw', md: '30vw' },
        maxWidth: { xs: 420, sm: 700, md: 800 },
        minWidth: {xs: 280, sm: 400, md: 600},
        border: 'none',
        borderRadius: 5,
        backgroundColor: mode === 'light' ? 'rgba(255, 255, 255, 0.6)' : 'rgba(18, 18, 18, 0.89)'
      }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 3 }, borderRadius: 2, backgroundColor:'transparent' }}>
          <Typography variant="h3" align="left" fontWeight={600} sx={{ fontSize: { xs: '1.75rem', sm: '2rem', md: '2.5rem' } }}>
            {isSignup ? 'Sign Up' : 'Login'}
          </Typography>
          <Typography variant="body2" align="left" color="text.secondary" sx={{ mb: { xs: 2, sm: 3 } }} fontWeight={600}>
            Manage your reading collection
          </Typography>

          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleSubmit}>
            {isSignup && (
              <StyledTextField
                fullWidth
                label="Username"
                name="username"
                value={formData.username}
                onChange={handleChange}
                required
                margin="normal"
              />
            )}

            <StyledTextField
              fullWidth
              label="Email"
              name="email"
              type="email"
              value={formData.email}
              onChange={handleChange}
              required
              margin="normal"
            />

            <StyledTextField
              fullWidth
              label="Password"
              name="password"
              type="password"
              value={formData.password}
              onChange={handleChange}
              required
              margin="normal"
              inputProps={{ minLength: 6 }}
            />

            {isSignup && (
              <StyledTextField
                fullWidth
                label="Confirm Password"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
                margin="normal"
                inputProps={{ minLength: 6 }}
              />
            )}

            <GradientButton
              type="submit"
              fullWidth
              variant="contained"
              size="large"
              disabled={loading}
              sx={{
                mt: 3,
                py: 1.5,
                height: { xs: 48, sm: 58 },
                
              }}
            >
              {loading ? 'Please wait...' : isSignup ? 'Sign Up' : 'Login'}
            </GradientButton>
          </form>

          <Box sx={{ mt: 3, textAlign: 'center' }}>
            <Typography variant="body2" color="text.secondary" fontWeight={600}>
              {isSignup ? 'Already have an account? ' : "Don't have an account? "}
              <Link
                component="button"
                variant="body2"
                onClick={() => navigate(isSignup ? '/login' : '/signup')}
                sx={{ 
                  color: '#667eea', 
                  fontWeight: 600,
                  cursor: 'pointer',
                  textDecoration: 'none',
                  '&:hover': {
                    textDecoration: 'underline',
                  }
                }}
              >
                {isSignup ? 'Log in' : 'Sign up'}
              </Link>
            </Typography>
          </Box>
        </Paper>
      </Container>
    </Box>
  );
};

export default Login;
