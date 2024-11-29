import React from 'react';
import {
  Box,
  TextField,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  InputAdornment,
  Paper,
  Typography,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MapIcon from '@mui/icons-material/Map';

export const Search = () => {
  const mockEvents = [
    {
      id: 1,
      title: 'Festival',
      description: 'Central Park, Outdoor Concert, Music',
    },
    {
      id: 2,
      title: 'Event',
      description: 'Times Square, Tech Conference',
    },
    {
      id: 3,
      title: 'Theater Show',
      description: 'Broadway St. 123, 0000 New York',
    },
  ];

  return (
    <Box sx={{ pb: 7, px: 2, pt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Discover
      </Typography>
      
      <TextField
        fullWidth
        placeholder="Search Events"
        variant="outlined"
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
          sx: {
            borderRadius: '100px',
            backgroundColor: 'background.paper',
          },
        }}
        sx={{ mb: 3 }}
      />

      <List sx={{ width: '100%' }}>
        {mockEvents.map((event) => (
          <Paper
            key={event.id}
            elevation={1}
            sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}
          >
            <ListItem button>
              <ListItemIcon>
                <MapIcon />
              </ListItemIcon>
              <ListItemText
                primary={event.title}
                secondary={event.description}
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
                secondaryTypographyProps={{
                  sx: { color: 'text.secondary' },
                }}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default Search;
