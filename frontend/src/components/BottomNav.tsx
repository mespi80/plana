import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { BottomNavigation, BottomNavigationAction, Paper } from '@mui/material';
import HomeIcon from '@mui/icons-material/Home';
import SearchIcon from '@mui/icons-material/Search';
import EventIcon from '@mui/icons-material/Event';
import PersonIcon from '@mui/icons-material/Person';

const BottomNav = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getActiveIndex = () => {
    switch (location.pathname) {
      case '/map':
        return 0;
      case '/search':
        return 1;
      case '/list':
        return 2;
      case '/settings':
        return 3;
      default:
        return 0;
    }
  };

  return (
    <Paper
      sx={{
        position: 'fixed',
        bottom: 0,
        left: 0,
        right: 0,
        zIndex: 1000,
      }}
      elevation={3}
    >
      <BottomNavigation
        value={getActiveIndex()}
        onChange={(_, newValue) => {
          switch (newValue) {
            case 0:
              navigate('/map');
              break;
            case 1:
              navigate('/search');
              break;
            case 2:
              navigate('/list');
              break;
            case 3:
              navigate('/settings');
              break;
          }
        }}
        showLabels
      >
        <BottomNavigationAction label="Home" icon={<HomeIcon />} />
        <BottomNavigationAction label="Search" icon={<SearchIcon />} />
        <BottomNavigationAction label="Events" icon={<EventIcon />} />
        <BottomNavigationAction label="Profile" icon={<PersonIcon />} />
      </BottomNavigation>
    </Paper>
  );
};

export default BottomNav;
