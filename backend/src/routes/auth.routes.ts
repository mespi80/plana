import express from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/user.model';
import { AppError } from '../middleware/error.middleware';
import { protect } from '../middleware/auth.middleware';
import { googleAuth, validateToken } from '../controllers/auth.controller';

const router = express.Router();

const signToken = (id: string) => {
  return jwt.sign({ id }, process.env.JWT_SECRET!, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

// Google Authentication
router.post('/google', googleAuth);

// Validate Token
router.get('/validate', validateToken);

// Register new user
router.post('/register', async (req, res, next) => {
  try {
    const { email, password, firstName, lastName } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return next(new AppError('Email already exists', 400));
    }

    const user = await User.create({
      email,
      password,
      firstName,
      lastName,
    });

    const token = signToken(user._id);

    res.status(201).json({
      status: 'success',
      token,
      data: {
        user,
      },
    });
  } catch (error) {
    next(error);
  }
});

// Login user
router.post('/login', async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return next(new AppError('Please provide email and password', 400));
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await user.comparePassword(password))) {
      return next(new AppError('Incorrect email or password', 401));
    }

    const token = signToken(user._id);

    res.status(200).json({
      status: 'success',
      token,
    });
  } catch (error) {
    next(error);
  }
});

// Get current user
router.get('/me', protect, async (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      user: req.user,
    },
  });
});

export default router;
