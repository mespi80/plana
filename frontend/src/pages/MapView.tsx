import React, { useState, useEffect, useCallback, useRef } from 'react';
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
import { API_ENDPOINTS } from '../config/api';
import { useAuth } from '../contexts/AuthContext';

interface Location {
  lat: number;
  lng: number;
}

interface Place {
  _id: string;
  name: string;
  description: string;
  location: {
    type: string;
    coordinates: [number, number]; // [longitude, latitude]
  };
  address: string;
  type: string;
}

interface MapBounds {
  ne: Location;
  sw: Location;
}

const MapView = () => {
  const { token } = useAuth();
  const [selectedPlace, setSelectedPlace] = useState<Place | null>(null);
  const [places, setPlaces] = useState<Place[]>([]);
  const [center, setCenter] = useState<Location>({ lat: 37.7749, lng: -122.4194 }); // Default to San Francisco
  const [error, setError] = useState<string>('');
  const [isLocating, setIsLocating] = useState(true);
  const [mapBounds, setMapBounds] = useState<MapBounds | null>(null);

  const { isLoaded } = useLoadScript({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY || '',
  });

  const fetchPlaces = useCallback(async (bounds: MapBounds) => {
    try {
      const response = await fetch(`${API_ENDPOINTS.PLACES}/bounds`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ne: bounds.ne,
          sw: bounds.sw,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch places');
      }

      const data = await response.json();
      if (data.success) {
        setPlaces(data.data);
      } else {
        throw new Error(data.error || 'Failed to fetch places');
      }
    } catch (error) {
      console.error('Error fetching places:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch places');
    }
  }, [token]);

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

  useEffect(() => {
    if (mapBounds) {
      fetchPlaces(mapBounds);
    }
  }, [mapBounds, fetchPlaces]);

  const mapRef = useRef<google.maps.Map>();
  const handleBoundsChanged = useCallback(() => {
    if (!mapRef.current) return;
    const bounds = mapRef.current.getBounds();
    if (bounds) {
      const ne = bounds.getNorthEast();
      const sw = bounds.getSouthWest();
      setMapBounds({
        ne: { lat: ne.lat(), lng: ne.lng() },
        sw: { lat: sw.lat(), lng: sw.lng() },
      });
    }
  }, []);

  const onLoad = useCallback((map: google.maps.Map) => {
    mapRef.current = map;
  }, []);

  const onUnmount = useCallback(() => {
    mapRef.current = undefined;
  }, []);

  if (!isLoaded || isLocating) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ height: '100vh', display: 'flex', flexDirection: 'column' }}>
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
          onLoad={onLoad}
          onUnmount={onUnmount}
          onBoundsChanged={handleBoundsChanged}
        >
          {places.map((place) => (
            <MarkerF
              key={place._id}
              position={{
                lat: place.location.coordinates[1],
                lng: place.location.coordinates[0],
              }}
              onClick={() => setSelectedPlace(place)}
            />
          ))}
        </GoogleMap>

        <Drawer
          anchor="right"
          open={!!selectedPlace}
          onClose={() => setSelectedPlace(null)}
          PaperProps={{
            sx: { width: '300px' },
          }}
        >
          {selectedPlace && (
            <Box sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">{selectedPlace.name}</Typography>
                <IconButton onClick={() => setSelectedPlace(null)}>
                  <CloseIcon />
                </IconButton>
              </Box>
              <Typography variant="body1" color="text.secondary" paragraph>
                {selectedPlace.description}
              </Typography>
              <Typography variant="body2" color="text.secondary" gutterBottom>
                Type: {selectedPlace.type}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Address: {selectedPlace.address}
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
