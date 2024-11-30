import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { 
  Box, 
  Typography, 
  Alert, 
  Snackbar, 
  CircularProgress, 
  Paper,
  Container,
  useTheme
} from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);
  const theme = useTheme();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      setIsAuthenticating(true);
      console.log('Google login response:', credentialResponse);

      const response = await fetch(`${API_ENDPOINTS.GOOGLE_AUTH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Network error' }));
        console.error('Backend error:', errorData);
        throw new Error(errorData.error || 'Authentication failed');
      }

      const data = await response.json();
      console.log('Backend response:', data);

      if (data.token) {
        await login(data.token);
      } else {
        throw new Error('No token received from server');
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
      setError(error instanceof Error ? error.message : 'An error occurred during authentication');
    } finally {
      setIsAuthenticating(false);
    }
  };

  if (isLoading || isAuthenticating) {
    return (
      <Box
        sx={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          bgcolor: 'background.default',
        }}
      >
        <CircularProgress sx={{ color: theme.palette.primary.main }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        minHeight: '100vh',
        display: 'flex',
        bgcolor: 'background.default',
        py: 8,
      }}
    >
      <Container maxWidth="sm">
        <Paper
          elevation={3}
          sx={{
            p: 4,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            borderRadius: 2,
            background: `linear-gradient(to bottom right, ${theme.palette.background.paper}, ${theme.palette.background.default})`,
          }}
        >
          <Box
            sx={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 3,
            }}
          >
            <Box
              component="img"
              src="/assets/plana-logo.svg"
              alt="Plana Logo"
              sx={{
                width: 120,
                height: 120,
                mb: 2,
              }}
            />
            <Typography
              component="h1"
              variant="h3"
              sx={{
                color: 'text.primary',
                fontWeight: 'bold',
                textAlign: 'center',
              }}
            >
              Welcome to Plana
            </Typography>
            <Typography
              variant="h6"
              sx={{
                color: 'text.secondary',
                textAlign: 'center',
                maxWidth: '80%',
                mb: 4,
              }}
            >
              Discover and explore amazing events around you
            </Typography>
            <Box 
              sx={{ 
                display: 'flex', 
                flexDirection: 'column', 
                alignItems: 'center',
                gap: 2,
                width: '100%',
                maxWidth: 320,
              }}
            >
              <GoogleLogin
                onSuccess={handleGoogleSuccess}
                onError={() => {
                  console.error('Login Failed');
                  setError('Google login failed');
                }}
                useOneTap
                theme="filled_blue"
                size="large"
                shape="pill"
              />
              <Typography
                variant="body2"
                sx={{
                  color: 'text.secondary',
                  textAlign: 'center',
                  mt: 2,
                }}
              >
                Sign in with your Google account to continue
              </Typography>
            </Box>
          </Box>
        </Paper>
      </Container>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert 
          onClose={() => setError('')} 
          severity="error" 
          sx={{ 
            width: '100%',
            boxShadow: theme.shadows[3],
          }}
        >
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};
