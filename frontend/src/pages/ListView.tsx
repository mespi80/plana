import React, { useState } from 'react';
import {
  Container,
  List,
  ListItem,
  ListItemText,
  Typography,
  Paper,
  Box,
  Chip,
  TextField,
  InputAdornment,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const ListView = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedEvent, setSelectedEvent] = useState<any>(null);

  // Mock events data - replace with API call
  const events = [
    {
      id: 1,
      title: 'Music Festival',
      description: 'Annual music festival featuring local bands',
      location: '123 Main St, San Francisco, CA',
      date: '2023-06-15',
      distance: '0.5',
      category: 'Music',
    },
    {
      id: 2,
      title: 'Food Fair',
      description: 'Street food festival with local vendors',
      location: '456 Market St, San Francisco, CA',
      date: '2023-06-20',
      distance: '1.2',
      category: 'Food & Drink',
    },
  ];

  const filteredEvents = events.filter((event) =>
    event.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    event.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <TextField
        fullWidth
        variant="outlined"
        placeholder="Search events..."
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon />
            </InputAdornment>
          ),
        }}
        sx={{ mb: 4 }}
      />

      <List>
        {filteredEvents.map((event) => (
          <Paper
            key={event.id}
            elevation={1}
            sx={{ mb: 2, '&:hover': { boxShadow: 3, cursor: 'pointer' } }}
            onClick={() => setSelectedEvent(event)}
          >
            <ListItem>
              <Box sx={{ width: '100%' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                  <Typography variant="h6">{event.title}</Typography>
                  <Chip label={event.category} color="primary" size="small" />
                </Box>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Box sx={{ display: 'flex', gap: 2, color: 'text.secondary' }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <LocationOnIcon fontSize="small" />
                    <Typography variant="body2">{event.distance} miles away</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                    <CalendarTodayIcon fontSize="small" />
                    <Typography variant="body2">{event.date}</Typography>
                  </Box>
                </Box>
              </Box>
            </ListItem>
          </Paper>
        ))}
      </List>

      <Dialog open={!!selectedEvent} onClose={() => setSelectedEvent(null)} maxWidth="sm" fullWidth>
        {selectedEvent && (
          <>
            <DialogTitle>{selectedEvent.title}</DialogTitle>
            <DialogContent>
              <Typography variant="body1" paragraph>
                {selectedEvent.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                <LocationOnIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {selectedEvent.location}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                <CalendarTodayIcon fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                {selectedEvent.date}
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedEvent(null)}>Close</Button>
              <Button variant="contained" color="primary">
                Get Directions
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </Container>
  );
};

export default ListView;
