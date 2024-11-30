import express from 'express';
import { placeController } from '../controllers/place.controller';
import { authenticateToken } from '../middleware/auth';

const router = express.Router();

// Public routes
router.get('/search', placeController.searchByLocation);
router.get('/', placeController.getAll);
router.get('/:id', placeController.getById);

// Protected routes (require authentication)
router.use(authenticateToken);
router.post('/', placeController.create);
router.post('/bounds', placeController.getPlacesInBounds);
router.put('/:id', placeController.update);
router.delete('/:id', placeController.delete);

export default router;
