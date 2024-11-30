import React from 'react';
import {
  Box,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Typography,
} from '@mui/material';
import EventIcon from '@mui/icons-material/Event';

const ListView = () => {
  const events = [
    {
      id: 1,
      title: 'Music Festival',
      description: 'Annual music festival featuring local bands',
      date: '2023-06-15',
    },
    {
      id: 2,
      title: 'Food Fair',
      description: 'Street food festival with local vendors',
      date: '2023-06-20',
    },
  ];

  return (
    <Box sx={{ pb: 7, px: 2, pt: 2 }}>
      <Typography variant="h5" sx={{ mb: 2 }}>
        My Events
      </Typography>

      <List sx={{ width: '100%' }}>
        {events.map((event) => (
          <Paper
            key={event.id}
            elevation={1}
            sx={{ mb: 2, borderRadius: 2, overflow: 'hidden' }}
          >
            <ListItem button>
              <ListItemIcon>
                <EventIcon />
              </ListItemIcon>
              <ListItemText
                primary={event.title}
                secondary={
                  <>
                    <Typography variant="body2" color="text.secondary">
                      {event.description}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {event.date}
                    </Typography>
                  </>
                }
                primaryTypographyProps={{
                  fontWeight: 500,
                }}
              />
            </ListItem>
          </Paper>
        ))}
      </List>
    </Box>
  );
};

export default ListView;
