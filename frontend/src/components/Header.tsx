import React from 'react';
import { AppBar, Toolbar, Button, Box, Typography, useTheme } from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const getPageTitle = (pathname: string): string => {
  switch (pathname) {
    case '/map':
      return 'Places nearby';
    case '/search':
      return 'Discover';
    case '/events':
      return 'Events';
    case '/settings':
      return 'Settings';
    case '/admin/places':
      return 'Places Management';
    case '/admin/events':
      return 'Manage Events';
    default:
      return '';
  }
};

export const Header = () => {
  const theme = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const { logout } = useAuth();

  const pageTitle = getPageTitle(location.pathname);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  if (location.pathname === '/login') return null;

  return (
    <AppBar 
      position="static" 
      elevation={0}
      sx={{
        backgroundColor: theme.palette.background.paper,
        borderBottom: `1px solid ${theme.palette.divider}`,
      }}
    >
      <Toolbar sx={{ justifyContent: 'space-between' }}>
        <Typography variant="h6" color="text.primary">
          {pageTitle}
        </Typography>
        <Box>
          <Button 
            onClick={handleLogout}
            variant="outlined"
            color="primary"
            size="small"
          >
            Logout
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};
