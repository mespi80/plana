import express from 'express';
import { protect } from '../middleware/auth.middleware';
import { Event } from '../models/event.model';
import { AppError } from '../middleware/error.middleware';

const router = express.Router();

// Public routes
router.get('/', async (req, res, next) => {
  try {
    const { lat, lng, distance = 10000, category } = req.query;

    let query: any = {};

    // Add geospatial query if coordinates are provided
    if (lat && lng) {
      query.location = {
        $near: {
          $geometry: {
            type: 'Point',
            coordinates: [parseFloat(lng as string), parseFloat(lat as string)],
          },
          $maxDistance: parseInt(distance as string), // Distance in meters
        },
      };
    }

    // Add category filter if provided
    if (category) {
      query.category = category;
    }

    const events = await Event.find(query)
      .populate('organizer', 'name')
      .sort({ date: 1 });

    res.status(200).json({
      status: 'success',
      results: events.length,
      data: {
        events,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'name')
      .populate('attendees', 'name');

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    res.status(200).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Protected routes (require authentication)
router.use(protect);

router.post('/', async (req, res, next) => {
  try {
    const event = await Event.create({
      ...req.body,
      organizer: req.user._id,
    });

    res.status(201).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.patch('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return next(new AppError('You are not authorized to update this event', 403));
    }

    const updatedEvent = await Event.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true,
    });

    res.status(200).json({
      status: 'success',
      data: {
        event: updatedEvent,
      },
    });
  } catch (error) {
    next(error);
  }
});

router.delete('/:id', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    // Check if user is the organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      return next(new AppError('You are not authorized to delete this event', 403));
    }

    await event.deleteOne();

    res.status(204).json({
      status: 'success',
      data: null,
    });
  } catch (error) {
    next(error);
  }
});

router.post('/:id/attend', async (req, res, next) => {
  try {
    const event = await Event.findById(req.params.id);

    if (!event) {
      return next(new AppError('Event not found', 404));
    }

    if (event.attendees.includes(req.user._id)) {
      return next(new AppError('You are already attending this event', 400));
    }

    event.attendees.push(req.user._id);
    await event.save();

    res.status(200).json({
      status: 'success',
      data: {
        event,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
