import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model';
import { AuthError } from '../types/errors';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response) => {
  try {
    const { credential } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      throw new AuthError('Invalid token payload');
    }

    const { email, given_name, family_name, picture } = payload;

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      user = await User.create({
        email,
        firstName: given_name || '',
        lastName: family_name || '',
        profilePicture: picture,
        authProvider: 'google',
        role: 'host' // Set default role
      });
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    res.status(200).json({
      token,
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Google auth error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      throw new AuthError('No token provided');
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    const user = await User.findById(decoded.userId);

    if (!user) {
      throw new AuthError('User not found');
    }

    res.status(200).json({
      user: {
        id: user._id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        profilePicture: user.profilePicture,
        role: user.role
      }
    });
  } catch (error) {
    console.error('Token validation error:', error);
    res.status(401).json({ 
      error: 'Invalid token',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};
