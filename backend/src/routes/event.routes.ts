import express, { Request, Response } from 'express';
import { authenticateToken } from '../middleware/auth';
import { Event } from '../models/event.model';

const router = express.Router();

// Public routes
router.get('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find()
      .populate('place')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/upcoming', async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find({
      date: { $gte: new Date() }
    })
      .populate('place')
      .sort({ date: 1 })
      .limit(10);

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('place');

    if (!event) {
      res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: event,
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.get('/place/:placeId', async (req: Request, res: Response): Promise<void> => {
  try {
    const events = await Event.find({ place: req.params.placeId })
      .populate('place')
      .sort({ date: 1 });

    res.status(200).json({
      success: true,
      data: events,
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

// Protected routes (require authentication)
router.use(authenticateToken);

router.post('/', async (req: Request, res: Response): Promise<void> => {
  try {
    const event = new Event(req.body);
    await event.save();
    res.status(201).json({ 
      success: true, 
      data: event 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.put('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    ).populate('place');

    if (!event) {
      res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
      return;
    }

    res.status(200).json({ 
      success: true, 
      data: event 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

router.delete('/:id', async (req: Request, res: Response): Promise<void> => {
  try {
    const event = await Event.findByIdAndDelete(req.params.id);
    if (!event) {
      res.status(404).json({ 
        success: false, 
        error: 'Event not found' 
      });
      return;
    }
    res.status(200).json({ 
      success: true, 
      data: {} 
    });
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: error.message 
    });
  }
});

export default router;
