import mongoose from 'mongoose';
import dotenv from 'dotenv';
import { User } from '../models/user.model';
import { Event } from '../models/event.model';

dotenv.config();

const sampleUsers = [
  {
    name: 'John Doe',
    email: 'john@example.com',
    password: 'password123',
  },
  {
    name: 'Jane Smith',
    email: 'jane@example.com',
    password: 'password123',
  },
];

const sampleEvents = [
  {
    title: 'Tech Meetup',
    description: 'Monthly tech meetup for developers',
    date: new Date('2024-02-01'),
    location: {
      type: 'Point',
      coordinates: [-122.4194, 37.7749], // San Francisco coordinates
      address: '123 Tech Street, San Francisco, CA',
    },
    category: 'Technology',
    price: 0,
    capacity: 50,
  },
  {
    title: 'Music Festival',
    description: 'Annual music festival featuring local bands',
    date: new Date('2024-02-15'),
    location: {
      type: 'Point',
      coordinates: [-122.4314, 37.7793], // Different SF location
      address: '456 Music Avenue, San Francisco, CA',
    },
    category: 'Music',
    price: 25,
    capacity: 200,
  },
  {
    title: 'Food & Wine Tasting',
    description: 'Explore local cuisines and wines',
    date: new Date('2024-02-10'),
    location: {
      type: 'Point',
      coordinates: [-122.4124, 37.7884], // Another SF location
      address: '789 Food Street, San Francisco, CA',
    },
    category: 'Food & Drink',
    price: 45,
    capacity: 30,
  },
];

async function seedDatabase() {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/plana');
    console.log('Connected to MongoDB');

    // Clear existing data
    await User.deleteMany({});
    await Event.deleteMany({});
    console.log('Cleared existing data');

    // Create users
    const createdUsers = await User.create(sampleUsers);
    console.log('Created sample users');

    // Create events with random organizers
    const eventsWithOrganizers = sampleEvents.map(event => ({
      ...event,
      organizer: createdUsers[Math.floor(Math.random() * createdUsers.length)]._id,
    }));

    await Event.create(eventsWithOrganizers);
    console.log('Created sample events');

    // Add random attendees to events
    const events = await Event.find({});
    for (const event of events) {
      const randomAttendees = createdUsers
        .filter(() => Math.random() > 0.5)
        .map(user => user._id);
      event.attendees = randomAttendees;
      await event.save();
    }
    console.log('Added random attendees to events');

    console.log('Database seeding completed successfully');
  } catch (error) {
    console.error('Error seeding database:', error);
  } finally {
    await mongoose.connection.close();
  }
}

seedDatabase();
