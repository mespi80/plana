import React, { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { Box, Typography, Alert, Snackbar, CircularProgress } from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

export const Login: React.FC = () => {
  const { login, isLoading } = useAuth();
  const [error, setError] = useState<string>('');
  const [isAuthenticating, setIsAuthenticating] = useState(false);

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
          background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
        }}
      >
        <CircularProgress sx={{ color: 'white' }} />
      </Box>
    );
  }

  return (
    <Box
      sx={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(45deg, #FE6B8B 30%, #FF8E53 90%)',
      }}
    >
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: 4,
        }}
      >
        <Typography
          component="h1"
          variant="h2"
          sx={{
            color: 'white',
            fontWeight: 'bold',
            textShadow: '2px 2px 4px rgba(0,0,0,0.2)',
            mb: 2,
          }}
        >
          Plana
        </Typography>
        <Typography
          variant="h6"
          sx={{
            color: 'white',
            textAlign: 'center',
            mb: 4,
            textShadow: '1px 1px 2px rgba(0,0,0,0.2)',
          }}
        >
          Discover Events Around You
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
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
        </Box>
      </Box>
      <Snackbar 
        open={!!error} 
        autoHideDuration={6000} 
        onClose={() => setError('')}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <Alert onClose={() => setError('')} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </Box>
  );
};
