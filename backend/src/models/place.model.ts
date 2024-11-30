import mongoose from 'mongoose';
import validator from 'validator';

export interface IPlace extends mongoose.Document {
  name: string;
  address: string;
  location: {
    type: string;
    coordinates: number[];
  };
  types: string[];
  capacity: number;
  picture?: string;
  link?: string;
  createdAt: Date;
  updatedAt: Date;
}

const placeSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Place name is required'],
      trim: true,
    },
    address: {
      type: String,
      required: [true, 'Address is required'],
      trim: true,
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
        default: 'Point',
      },
      coordinates: {
        type: [Number],
        required: [true, 'Coordinates are required'],
        validate: {
          validator: function(v: number[]) {
            return v.length === 2 && 
                   v[0] >= -180 && v[0] <= 180 && // longitude
                   v[1] >= -90 && v[1] <= 90;     // latitude
          },
          message: 'Invalid coordinates format. Use [longitude, latitude] within valid ranges.'
        }
      }
    },
    types: {
      type: [String],
      required: [true, 'At least one place type is required'],
      enum: ['restaurant', 'bar', 'club', 'venue', 'park', 'theater', 'museum', 'gallery', 'other'],
    },
    capacity: {
      type: Number,
      required: [true, 'Capacity is required'],
      min: [1, 'Capacity must be at least 1'],
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

// Create geospatial index for location-based queries
placeSchema.index({ location: '2dsphere' });

export const Place = mongoose.model<IPlace>('Place', placeSchema);
