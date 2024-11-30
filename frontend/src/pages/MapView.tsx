import React, { useState, useEffect } from 'react';
import { GoogleMap, useLoadScript, MarkerF } from '@react-google-maps/api';
import {
  Box,
  Paper,
  Typography,
  CircularProgress,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Snackbar,
  Alert,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

interface Location {
  lat: number;
  lng: number;
}

const MapView = () => {
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [center, setCenter] = useState<Location>({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
  const [error, setError] = useState<string>('');
  const [isLocating, setIsLocating] = useState(true);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  useEffect(() => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCenter({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setIsLocating(false);
        },
        (error) => {
          console.error('Error getting location:', error);
          setError('Unable to get your location. Using default location.');
          setIsLocating(false);
        },
        {
          enableHighAccuracy: true,
          timeout: 5000,
          maximumAge: 0,
        }
      );
    } else {
      setError('Geolocation is not supported by your browser');
      setIsLocating(false);
    }
  }, []);

  // Mock events data - replace with API call
  const events = [
    {
      id: 1,
      title: 'Music Festival',
      description: 'Annual music festival featuring local bands',
      location: { lat: 37.7749, lng: -122.4194 },
      date: '2023-06-15',
    },
    {
      id: 2,
      title: 'Food Fair',
      description: 'Street food festival with local vendors',
      location: { lat: 37.7848, lng: -122.4294 },
      date: '2023-06-20',
    },
  ];

  if (!isLoaded || isLocating) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
      <Box sx={{ px: 2, pt: 2, pb: 1 }}>
        <Typography variant="h5" sx={{ mb: 2 }}>
          Events nearby
        </Typography>
      </Box>
      <Box sx={{ flex: 1, position: 'relative' }}>
        <GoogleMap
          zoom={13}
          center={center}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
        >
          {events.map((event) => (
            <MarkerF
              key={event.id}
              position={event.location}
              onClick={() => setSelectedEvent(event)}
            />
          ))}
        </GoogleMap>

        <Drawer
          anchor="right"
          open={!!selectedEvent}
          onClose={() => setSelectedEvent(null)}
          PaperProps={{
            sx: { width: '300px' },
          }}
        >
          {selectedEvent && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{selectedEvent.title}</Typography>
                <IconButton onClick={() => setSelectedEvent(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                {selectedEvent.description}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Date: {selectedEvent.date}
              </Typography>
            </Box>
          )}
        </Drawer>

        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError('')}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
        >
          <Alert onClose={() => setError('')} severity="warning" sx={{ width: '100%' }}>
            {error}
          </Alert>
        </Snackbar>
      </Box>
    </Box>
  );
};

export default MapView;
