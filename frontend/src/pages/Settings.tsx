import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  Box,
  Container,
  Paper,
  TextField,
  Switch,
  FormControlLabel,
  Button,
  Typography,
  Stack,
} from '@mui/material';
import { API_ENDPOINTS } from '../config/api';

interface SettingsForm {
  firstName: string;
  lastName: string;
  darkMode: boolean;
}

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const [form, setForm] = useState<SettingsForm>({
    firstName: '',
    lastName: '',
    darkMode: false,
  });

  useEffect(() => {
    if (user) {
      setForm({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        darkMode: user.darkMode || false,
      });
    }
  }, [user]);

  const handleChange = (field: keyof SettingsForm) => (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setForm({
      ...form,
      [field]: field === 'darkMode' ? event.target.checked : event.target.value,
    });
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch(API_ENDPOINTS.USER_SETTINGS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (response.ok) {
        const { data } = await response.json();
        updateUser(data.user);
        navigate('/map');
      } else {
        console.error('Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  const handleCancel = () => {
    navigate('/map');
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Paper elevation={3} sx={{ p: 4, width: '100%' }}>
          <Typography component="h1" variant="h5" sx={{ mb: 3 }}>
            Settings
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate>
            <Stack spacing={3}>
              <TextField
                fullWidth
                label="First Name"
                value={form.firstName}
                onChange={handleChange('firstName')}
              />
              <TextField
                fullWidth
                label="Last Name"
                value={form.lastName}
                onChange={handleChange('lastName')}
              />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.darkMode}
                    onChange={handleChange('darkMode')}
                  />
                }
                label="Dark Mode"
              />
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end' }}>
                <Button
                  variant="outlined"
                  onClick={handleCancel}
                  sx={{ width: '100px' }}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{ width: '100px' }}
                >
                  Apply
                </Button>
              </Box>
            </Stack>
          </Box>
        </Paper>
      </Box>
    </Container>
  );
};
