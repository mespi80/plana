import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { Place } from '../models/place.model';
import { Event } from '../models/event.model';

dotenv.config();

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plana');
    console.log('Connected to MongoDB');

    // Clear existing data
    await Place.deleteMany({});
    await Event.deleteMany({});

    // Create sample places
    const places = await Place.create([
      {
        name: 'The Grand Hall',
        address: '123 Main St, San Francisco, CA 94105',
        location: {
          type: 'Point',
          coordinates: [-122.419416, 37.774929],
        },
        types: ['venue'],
        capacity: 500,
        picture: 'https://example.com/grand-hall.jpg',
        link: 'https://grandhall.com',
      },
      {
        name: 'City Park Amphitheater',
        address: '456 Park Ave, San Francisco, CA 94102',
        location: {
          type: 'Point',
          coordinates: [-122.431297, 37.769042],
        },
        types: ['venue', 'park'],
        capacity: 1000,
        picture: 'https://example.com/amphitheater.jpg',
        link: 'https://sfparks.org/amphitheater',
      },
      {
        name: 'The Blue Note Jazz Club',
        address: '789 Jazz St, San Francisco, CA 94103',
        location: {
          type: 'Point',
          coordinates: [-122.412223, 37.783579],
        },
        types: ['club', 'venue'],
        capacity: 200,
        picture: 'https://example.com/blue-note.jpg',
        link: 'https://bluenotesf.com',
      },
    ]);

    // Create sample events
    const events = await Event.create([
      {
        name: 'Summer Music Festival',
        place: places[0]._id,
        date: new Date('2024-07-15T18:00:00'),
        price: 50,
        picture: 'https://example.com/summer-fest.jpg',
        link: 'https://summerfest.com',
      },
      {
        name: 'Shakespeare in the Park',
        place: places[1]._id,
        date: new Date('2024-06-20T19:30:00'),
        price: 0,
        picture: 'https://example.com/shakespeare.jpg',
        link: 'https://sfshakes.org',
      },
      {
        name: 'Jazz Night',
        place: places[2]._id,
        date: new Date('2024-05-10T20:00:00'),
        price: 25,
        picture: 'https://example.com/jazz-night.jpg',
        link: 'https://jazznight.com',
      },
    ]);

    console.log('Database seeded successfully!');
    console.log(`Created ${places.length} places`);
    console.log(`Created ${events.length} events`);

  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
};

seedDatabase();
