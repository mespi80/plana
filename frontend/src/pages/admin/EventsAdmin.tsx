import React, { useState, useEffect } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Typography,
  Paper,
  IconButton,
  Stack,
  Grid,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import dayjs from 'dayjs';

interface Place {
  _id: string;
  name: string;
}

interface Event {
  _id: string;
  name: string;
  place: Place;
  date: string;
  price: number;
  picture?: string;
  link?: string;
}

const initialFormState = {
  name: '',
  placeId: '',
  date: dayjs(),
  price: '',
  picture: '',
  link: '',
};

export const EventsAdmin = () => {
  const { token } = useAuth();
  const [events, setEvents] = useState<Event[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchEvents();
    fetchPlaces();
  }, []);

  const fetchEvents = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.EVENTS, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setEvents(data.data);
      }
    } catch (error) {
      console.error('Error fetching events:', error);
    }
  };

  const fetchPlaces = async () => {
    try {
      const response = await fetch(API_ENDPOINTS.PLACES, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = await response.json();
      if (data.success) {
        setPlaces(data.data);
      }
    } catch (error) {
      console.error('Error fetching places:', error);
    }
  };

  const handleOpen = (event?: Event) => {
    if (event) {
      setFormData({
        name: event.name,
        placeId: event.place._id,
        date: dayjs(event.date),
        price: event.price.toString(),
        picture: event.picture || '',
        link: event.link || '',
      });
      setEditingId(event._id);
    } else {
      setFormData(initialFormState);
      setEditingId(null);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormState);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const eventData = {
      name: formData.name,
      place: formData.placeId,
      date: formData.date.toISOString(),
      price: Number(formData.price),
      picture: formData.picture,
      link: formData.link,
    };

    try {
      const url = editingId 
        ? `${API_ENDPOINTS.EVENTS}/${editingId}`
        : API_ENDPOINTS.EVENTS;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(eventData),
      });

      if (response.ok) {
        handleClose();
        fetchEvents();
      }
    } catch (error) {
      console.error('Error saving event:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.EVENTS}/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          fetchEvents();
        }
      } catch (error) {
        console.error('Error deleting event:', error);
      }
    }
  };

  return (
    <Box sx={{ pb: 7, px: 2, pt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Events Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ mb: 3 }}
      >
        Add New Event
      </Button>

      <Grid container spacing={2}>
        {events.map((event) => (
          <Grid item xs={12} key={event._id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{event.name}</Typography>
                  <Typography color="text.secondary">
                    {event.place.name} • {dayjs(event.date).format('MMM D, YYYY h:mm A')}
                  </Typography>
                  <Typography color="text.secondary">
                    ${event.price}
                  </Typography>
                </Box>
                <Box>
                  <IconButton onClick={() => handleOpen(event)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(event._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Event' : 'Add New Event'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <FormControl fullWidth>
              <InputLabel>Place</InputLabel>
              <Select
                value={formData.placeId}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  placeId: e.target.value as string 
                })}
              >
                {places.map((place) => (
                  <MenuItem key={place._id} value={place._id}>
                    {place.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <DateTimePicker
              label="Date & Time"
              value={formData.date}
              onChange={(newValue) => newValue && setFormData({ 
                ...formData, 
                date: newValue 
              })}
            />
            <TextField
              label="Price"
              value={formData.price}
              onChange={(e) => setFormData({ ...formData, price: e.target.value })}
              fullWidth
              type="number"
            />
            <TextField
              label="Picture URL"
              value={formData.picture}
              onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
              fullWidth
            />
            <TextField
              label="External Link"
              value={formData.link}
              onChange={(e) => setFormData({ ...formData, link: e.target.value })}
              fullWidth
            />
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            {editingId ? 'Save Changes' : 'Create Event'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
