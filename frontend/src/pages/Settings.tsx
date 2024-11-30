import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useTheme } from '../contexts/ThemeContext';
import {
  Box,
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
    if (!token) return;

    try {
      const response = await fetch(API_ENDPOINTS.USER_SETTINGS, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      if (!response.ok) {
        throw new Error('Failed to update settings');
      }

      const data = await response.json();
      updateUser(data.data.user);
    } catch (error) {
      console.error('Error updating settings:', error);
    }
  };

  return (
    <Box sx={{ pb: 7, px: 2, pt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        Settings
      </Typography>

      <Paper sx={{ p: 3, borderRadius: 2 }}>
        <form onSubmit={handleSubmit}>
          <Stack spacing={3}>
            <TextField
              label="First Name"
              value={form.firstName}
              onChange={handleChange('firstName')}
              fullWidth
              variant="outlined"
            />
            <TextField
              label="Last Name"
              value={form.lastName}
              onChange={handleChange('lastName')}
              fullWidth
              variant="outlined"
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
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              sx={{ mt: 2 }}
            >
              Save Changes
            </Button>
          </Stack>
        </form>
      </Paper>
    </Box>
  );
};
