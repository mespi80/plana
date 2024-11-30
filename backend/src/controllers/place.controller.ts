import { Request, Response } from 'express';
import { Place } from '../models/place.model';

export const placeController = {
  // Create a new place
  create: async (req: Request, res: Response) => {
    try {
      const place = new Place(req.body);
      await place.save();
      res.status(201).json({ success: true, data: place });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get all places
  getAll: async (req: Request, res: Response) => {
    try {
      const places = await Place.find();
      res.status(200).json({ success: true, data: places });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get a single place by ID
  getById: async (req: Request, res: Response) => {
    try {
      const place = await Place.findById(req.params.id);
      if (!place) {
        return res.status(404).json({ success: false, error: 'Place not found' });
      }
      res.status(200).json({ success: true, data: place });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Update a place
  update: async (req: Request, res: Response) => {
    try {
      const place = await Place.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!place) {
        return res.status(404).json({ success: false, error: 'Place not found' });
      }
      res.status(200).json({ success: true, data: place });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Delete a place
  delete: async (req: Request, res: Response) => {
    try {
      const place = await Place.findByIdAndDelete(req.params.id);
      if (!place) {
        return res.status(404).json({ success: false, error: 'Place not found' });
      }
      res.status(200).json({ success: true, data: {} });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  },

  // Search places by location
  searchByLocation: async (req: Request, res: Response) => {
    try {
      const { longitude, latitude, maxDistance = 5000 } = req.query;
      
      const places = await Place.find({
        location: {
          $near: {
            $geometry: {
              type: 'Point',
              coordinates: [Number(longitude), Number(latitude)]
            },
            $maxDistance: Number(maxDistance)
          }
        }
      });
      
      res.status(200).json({ success: true, data: places });
    } catch (error) {
      res.status(400).json({ success: false, error: error.message });
    }
  }
};
