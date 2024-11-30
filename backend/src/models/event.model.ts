import mongoose from 'mongoose';
import { IPlace } from './place.model';

interface IEvent extends mongoose.Document {
  name: string;
  place: mongoose.Types.ObjectId | IPlace;
  date: Date;
  price: number;
  picture?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const eventSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Event name is required'],
      trim: true,
    },
    place: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Place',
      required: [true, 'Place is required'],
    },
    date: {
      type: Date,
      required: [true, 'Event date is required'],
      validate: {
        validator: function(v: Date) {
          return v > new Date();
        },
        message: 'Event date must be in the future'
      }
    },
    price: {
      type: Number,
      required: [true, 'Price is required'],
      min: [0, 'Price cannot be negative'],
    },
    picture: {
      type: String,
      trim: true,
    },
    link: {
      type: String,
      trim: true,
      validate: {
        validator: function(v: string) {
          return !v || validator.isURL(v);
        },
        message: 'Invalid URL format'
      }
    },
  },
  {
    timestamps: true,
  }
);

// Create compound index for efficient querying
eventSchema.index({ place: 1, date: 1 });

export const Event = mongoose.model<IEvent>('Event', eventSchema);
