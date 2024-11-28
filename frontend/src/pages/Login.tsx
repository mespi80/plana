import React from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { useAuth } from '../contexts/AuthContext';
import { Box, Container, Typography } from '@mui/material';
import { API_ENDPOINTS } from '../config/api';
import { useNavigate } from 'react-router-dom';

export const Login: React.FC = () => {
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleGoogleSuccess = async (credentialResponse: any) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.GOOGLE_AUTH}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          credential: credentialResponse.credential,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        await login(data.token);
        navigate('/map');
      } else {
        console.error('Google authentication failed');
      }
    } catch (error) {
      console.error('Error during Google authentication:', error);
    }
  };

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
        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log('Login Failed')}
          useOneTap
          theme="filled_blue"
          size="large"
          shape="pill"
        />
      </Box>
    </Box>
  );
};
