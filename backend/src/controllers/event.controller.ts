import { Request, Response } from 'express';
import { Event } from '../models/event.model';

export const eventController = {
  // Create a new event
  create: async (req: Request, res: Response): Promise<Response> => {
    try {
      const event = new Event(req.body);
      await event.save();
      return res.status(201).json({ success: true, data: event });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get all events
  getAll: async (req: Request, res: Response): Promise<Response> => {
    try {
      const events = await Event.find()
        .populate('place')
        .sort({ date: 1 });
      return res.status(200).json({ success: true, data: events });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get a single event by ID
  getById: async (req: Request, res: Response): Promise<Response> => {
    try {
      const event = await Event.findById(req.params.id)
        .populate('place');
      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      return res.status(200).json({ success: true, data: event });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Update an event
  update: async (req: Request, res: Response): Promise<Response> => {
    try {
      const event = await Event.findByIdAndUpdate(
        req.params.id,
        req.body,
        { new: true, runValidators: true }
      ).populate('place');
      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      return res.status(200).json({ success: true, data: event });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Delete an event
  delete: async (req: Request, res: Response): Promise<Response> => {
    try {
      const event = await Event.findByIdAndDelete(req.params.id);
      if (!event) {
        return res.status(404).json({ success: false, error: 'Event not found' });
      }
      return res.status(200).json({ success: true, data: {} });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get events by place
  getByPlace: async (req: Request, res: Response): Promise<Response> => {
    try {
      const events = await Event.find({ place: req.params.placeId })
        .populate('place')
        .sort({ date: 1 });
      return res.status(200).json({ success: true, data: events });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  },

  // Get upcoming events
  getUpcoming: async (req: Request, res: Response): Promise<Response> => {
    try {
      const events = await Event.find({
        date: { $gte: new Date() }
      })
        .populate('place')
        .sort({ date: 1 })
        .limit(10);
      return res.status(200).json({ success: true, data: events });
    } catch (error) {
      return res.status(400).json({ success: false, error: error.message });
    }
  }
};
