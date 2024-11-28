import express from 'express';
import { updateSettings } from '../controllers/user.controller';
import { protect } from '../middleware/auth.middleware';

const router = express.Router();

router.put('/settings', protect, updateSettings);

export default router;
