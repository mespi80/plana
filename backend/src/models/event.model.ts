import mongoose from 'mongoose';

interface ILocation {
  type: string;
  coordinates: number[];
  address: string;
}

interface IEvent extends mongoose.Document {
  title: string;
  description: string;
  date: Date;
  location: ILocation;
  category: string;
  organizer: mongoose.Types.ObjectId;
  attendees: mongoose.Types.ObjectId[];
  image: string;
  price: number;
  capacity: number;
}

const eventSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Please provide event title'],
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Please provide event description'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide event date'],
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
      address: {
        type: String,
        required: true,
      },
    },
    category: {
      type: String,
      required: [true, 'Please provide event category'],
      enum: ['Music', 'Food & Drink', 'Sports', 'Art', 'Technology', 'Other'],
    },
    organizer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    attendees: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
      },
    ],
    image: {
      type: String,
      default: 'default-event.jpg',
    },
    price: {
      type: Number,
      default: 0,
    },
    capacity: {
      type: Number,
      default: 0, // 0 means unlimited
    }
  },
  {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// Create geospatial index
eventSchema.index({ location: '2dsphere' });

// Virtual populate
eventSchema.virtual('attendeeCount').get(function () {
  return this.attendees.length;
});

// Virtual for checking if event is full
eventSchema.virtual('isFull').get(function () {
  return this.capacity > 0 && this.attendees.length >= this.capacity;
});

export const Event = mongoose.model<IEvent>('Event', eventSchema);
