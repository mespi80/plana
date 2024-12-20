import { Request, Response } from 'express';
import { Place } from '../models/place.model';

export const placeController = {
  // Create a new place
  create: async (req: Request, res: Response): Promise<Response> => {
    try {
      const place = new Place(req.body);
      await place.save();
      return res.status(201).json({ success: true, data: place });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get all places
  getAll: async (req: Request, res: Response): Promise<Response> => {
    try {
      const places = await Place.find();
      return res.status(200).json({ success: true, data: places });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get a single place by ID
  getById: async (req: Request, res: Response): Promise<Response> => {
    try {
      const place = await Place.findById(req.params.id);
      if (!place) {
        return res.status(404).json({ success: false, error: 'Place not found' });
      }
      return res.status(200).json({ success: true, data: place });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Update a place
  update: async (req: Request, res: Response): Promise<Response> => {
    try {
      const place = await Place.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      );
      if (!place) {
        return res.status(404).json({ success: false, error: 'Place not found' });
      }
      return res.status(200).json({ success: true, data: place });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Delete a place
  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      const place = await Place.findByIdAndDelete(req.params.id);
      if (!place) {
        return res.status(404).json({ success: false, error: 'Place not found' });
      }
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Search places by location
  searchByLocation: async (req: Request, res: Response): Promise<Response> => {
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
      
      return res.status(200).json({ success: true, data: places });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get places within bounds
  getPlacesInBounds: async (req: Request, res: Response): Promise<Response> => {
    try {
      const { ne, sw } = req.body;

      if (!ne || !sw || !ne.lat || !ne.lng || !sw.lat || !sw.lng) {
        return res.status(400).json({ 
          success: false, 
          error: 'Invalid bounds. Please provide ne and sw coordinates.' 
        });
      }

      const places = await Place.find({
        location: {
          $geoWithin: {
            $box: [
              [sw.lng, sw.lat], // [longitude, latitude]
              [ne.lng, ne.lat]
            ]
          }
        }
      });

      return res.status(200).json({ success: true, data: places });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};
