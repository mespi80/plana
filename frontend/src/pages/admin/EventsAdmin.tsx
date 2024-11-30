import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Button,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  IconButton,
  Select,
  MenuItem,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';
import dayjs, { Dayjs } from 'dayjs';

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

interface EventFormData {
  name: string;
  place: string;
  date: Dayjs | null;
  price: number;
  picture?: string;
  link?: string;
}

const initialFormData: EventFormData = {
  name: '',
  place: '',
  date: dayjs(),
  price: 0,
  picture: '',
  link: '',
};

const EventsAdmin: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [places, setPlaces] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<EventFormData>(initialFormData);
  const [editingId, setEditingId] = useState<string | null>(null);
  const { token } = useAuth();

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
      setEditingId(event._id);
      setFormData({
        name: event.name,
        place: event.place._id,
        date: dayjs(event.date),
        price: event.price,
        picture: event.picture || '',
        link: event.link || '',
      });
    } else {
      setEditingId(null);
      setFormData(initialFormData);
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setFormData(initialFormData);
    setEditingId(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
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
        body: JSON.stringify({
          ...formData,
          date: formData.date?.toISOString(),
        }),
      });

      const data = await response.json();
      if (data.success) {
        fetchEvents();
        handleClose();
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
    <LocalizationProvider dateAdapter={AdapterDayjs}>
      <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
        <Typography variant="h4" gutterBottom>
          Manage Events
        </Typography>
        
        <Button 
          variant="contained" 
          color="primary" 
          onClick={() => handleOpen()}
          sx={{ mb: 3 }}
        >
          Add New Event
        </Button>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>Name</TableCell>
                <TableCell>Place</TableCell>
                <TableCell>Date</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {events.map((event) => (
                <TableRow key={event._id}>
                  <TableCell>{event.name}</TableCell>
                  <TableCell>{event.place.name}</TableCell>
                  <TableCell>{dayjs(event.date).format('MMM D, YYYY h:mm A')}</TableCell>
                  <TableCell>${event.price}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleOpen(event)}>
                      <EditIcon />
                    </IconButton>
                    <IconButton onClick={() => handleDelete(event._id)}>
                      <DeleteIcon />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>

        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle>{editingId ? 'Edit Event' : 'Add New Event'}</DialogTitle>
          <form onSubmit={handleSubmit}>
            <DialogContent>
              <TextField
                fullWidth
                label="Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                margin="normal"
                required
              />
              
              <Select
                fullWidth
                value={formData.place}
                onChange={(e) => setFormData({ ...formData, place: e.target.value })}
                margin="dense"
                required
              >
                {places.map((place) => (
                  <MenuItem key={place._id} value={place._id}>
                    {place.name}
                  </MenuItem>
                ))}
              </Select>

              <DateTimePicker
                label="Date & Time"
                value={formData.date}
                onChange={(newValue: Dayjs | null) => newValue && setFormData({ 
                  ...formData, 
                  date: newValue 
                })}
                sx={{ width: '100%', mt: 2 }}
              />

              <TextField
                fullWidth
                label="Price"
                type="number"
                value={formData.price}
                onChange={(e) => setFormData({ ...formData, price: Number(e.target.value) })}
                margin="normal"
                required
              />

              <TextField
                fullWidth
                label="Picture URL"
                value={formData.picture}
                onChange={(e) => setFormData({ ...formData, picture: e.target.value })}
                margin="normal"
              />

              <TextField
                fullWidth
                label="Event Link"
                value={formData.link}
                onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                margin="normal"
              />
            </DialogContent>
            <DialogActions>
              <Button onClick={handleClose}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                {editingId ? 'Update' : 'Create'}
              </Button>
            </DialogActions>
          </form>
        </Dialog>
      </Container>
    </LocalizationProvider>
  );
};

export default EventsAdmin;
