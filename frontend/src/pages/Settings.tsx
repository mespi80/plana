import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
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
  Divider,
} from '@mui/material';
import { API_ENDPOINTS } from '../config/api';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';

interface SettingsForm {
  firstName: string;
  lastName: string;
  darkMode: boolean;
}

export const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { user, token, updateUser } = useAuth();
  const { isDarkMode, toggleDarkMode } = useTheme();
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
    const newValue = field === 'darkMode' ? event.target.checked : event.target.value;
    setForm({
      ...form,
      [field]: newValue,
    });
    if (field === 'darkMode') {
      toggleDarkMode();
    }
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
    <Container maxWidth="sm">
      <Box sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h5" gutterBottom>
            Settings
          </Typography>
          <form onSubmit={handleSubmit}>
            <Stack spacing={3}>
              <TextField
                label="First Name"
                value={form.firstName}
                onChange={handleChange('firstName')}
                fullWidth
              />
              <TextField
                label="Last Name"
                value={form.lastName}
                onChange={handleChange('lastName')}
                fullWidth
              />
              <Divider />
              <FormControlLabel
                control={
                  <Switch
                    checked={form.darkMode}
                    onChange={handleChange('darkMode')}
                    icon={<Brightness4Icon />}
                    checkedIcon={<Brightness7Icon />}
                  />
                }
                label={`${isDarkMode ? 'Dark' : 'Light'} Mode`}
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
          </form>
        </Paper>
      </Box>
    </Container>
  );
};
