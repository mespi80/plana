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
  Chip,
} from '@mui/material';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import { useAuth } from '../../contexts/AuthContext';
import { API_ENDPOINTS } from '../../config/api';

interface Place {
  _id: string;
  name: string;
  address: string;
  location: {
    coordinates: [number, number];
  };
  types: string[];
  capacity: number;
  picture?: string;
  link?: string;
}

const PLACE_TYPES = [
  'restaurant',
  'bar',
  'club',
  'venue',
  'park',
  'theater',
  'museum',
  'gallery',
  'other'
];

const initialFormState = {
  name: '',
  address: '',
  latitude: '',
  longitude: '',
  types: [] as string[],
  capacity: '',
  picture: '',
  link: '',
};

export const PlacesAdmin = () => {
  const { token } = useAuth();
  const [places, setPlaces] = useState<Place[]>([]);
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState(initialFormState);
  const [editingId, setEditingId] = useState<string | null>(null);

  useEffect(() => {
    fetchPlaces();
  }, []);

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

  const handleOpen = (place?: Place) => {
    if (place) {
      setFormData({
        name: place.name,
        address: place.address,
        latitude: place.location.coordinates[1].toString(),
        longitude: place.location.coordinates[0].toString(),
        types: place.types,
        capacity: place.capacity.toString(),
        picture: place.picture || '',
        link: place.link || '',
      });
      setEditingId(place._id);
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

  const validateForm = () => {
    if (!formData.name?.trim()) {
      alert('Name is required');
      return false;
    }
    if (!formData.address?.trim()) {
      alert('Address is required');
      return false;
    }
    if (!formData.latitude || !formData.longitude) {
      alert('Both latitude and longitude are required');
      return false;
    }
    if (Number(formData.latitude) < -90 || Number(formData.latitude) > 90) {
      alert('Latitude must be between -90 and 90');
      return false;
    }
    if (Number(formData.longitude) < -180 || Number(formData.longitude) > 180) {
      alert('Longitude must be between -180 and 180');
      return false;
    }
    if (!formData.types?.length) {
      alert('At least one place type is required');
      return false;
    }
    if (!formData.capacity || Number(formData.capacity) < 1) {
      alert('Capacity must be at least 1');
      return false;
    }
    if (formData.link && !formData.link.match(/^https?:\/\/.+/)) {
      alert('Link must be a valid URL starting with http:// or https://');
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    const placeData = {
      name: formData.name.trim(),
      address: formData.address.trim(),
      location: {
        type: 'Point',
        coordinates: [Number(formData.longitude), Number(formData.latitude)]
      },
      types: formData.types,
      capacity: Number(formData.capacity),
      picture: formData.picture?.trim() || undefined,
      link: formData.link?.trim() || undefined,
    };

    try {
      const url = editingId 
        ? `${API_ENDPOINTS.PLACES}/${editingId}`
        : API_ENDPOINTS.PLACES;
      
      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(placeData),
      });

      const data = await response.json();

      if (response.ok) {
        handleClose();
        fetchPlaces();
      } else {
        console.error('Error saving place:', data.error || 'Unknown error');
        alert(data.error || 'Failed to save place. Please check the form and try again.');
      }
    } catch (error) {
      console.error('Error saving place:', error);
      alert('Failed to save place. Please try again.');
    }
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this place?')) {
      try {
        const response = await fetch(`${API_ENDPOINTS.PLACES}/${id}`, {
          method: 'DELETE',
          headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
          fetchPlaces();
        }
      } catch (error) {
        console.error('Error deleting place:', error);
      }
    }
  };

  return (
    <Box sx={{ pb: 7, px: 2, pt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Places Management
      </Typography>

      <Button
        variant="contained"
        color="primary"
        onClick={() => handleOpen()}
        sx={{ mb: 3 }}
      >
        Add New Place
      </Button>

      <Grid container spacing={2}>
        {places.map((place) => (
          <Grid item xs={12} key={place._id}>
            <Paper sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                <Box>
                  <Typography variant="h6">{place.name}</Typography>
                  <Typography color="text.secondary">{place.address}</Typography>
                  <Box sx={{ mt: 1 }}>
                    {place.types.map((type) => (
                      <Chip
                        key={type}
                        label={type}
                        size="small"
                        sx={{ mr: 0.5, mb: 0.5 }}
                      />
                    ))}
                  </Box>
                </Box>
                <Box>
                  <IconButton onClick={() => handleOpen(place)}>
                    <EditIcon />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(place._id)}>
                    <DeleteIcon />
                  </IconButton>
                </Box>
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
        <DialogTitle>{editingId ? 'Edit Place' : 'Add New Place'}</DialogTitle>
        <DialogContent>
          <Stack spacing={2} sx={{ mt: 1 }}>
            <TextField
              label="Name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              fullWidth
            />
            <TextField
              label="Address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
              fullWidth
            />
            <Grid container spacing={2}>
              <Grid item xs={6}>
                <TextField
                  label="Latitude"
                  value={formData.latitude}
                  onChange={(e) => setFormData({ ...formData, latitude: e.target.value })}
                  fullWidth
                  type="number"
                />
              </Grid>
              <Grid item xs={6}>
                <TextField
                  label="Longitude"
                  value={formData.longitude}
                  onChange={(e) => setFormData({ ...formData, longitude: e.target.value })}
                  fullWidth
                  type="number"
                />
              </Grid>
            </Grid>
            <FormControl fullWidth>
              <InputLabel>Types</InputLabel>
              <Select
                multiple
                value={formData.types}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  types: e.target.value as string[] 
                })}
                renderValue={(selected) => (
                  <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {PLACE_TYPES.map((type) => (
                  <MenuItem key={type} value={type}>
                    {type}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Capacity"
              value={formData.capacity}
              onChange={(e) => setFormData({ ...formData, capacity: e.target.value })}
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
            {editingId ? 'Save Changes' : 'Create Place'}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};
