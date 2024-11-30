import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model';
import { AuthError } from '../types/errors';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Starting Google authentication...');
    const { credential } = req.body;
    
    if (!credential) {
      console.error('No credential provided');
      res.status(400).json({ 
        error: 'Authentication failed',
        details: 'No credential provided'
      });
      return;
    }

    console.log('Verifying Google token...');
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID
    });
    
    const payload = ticket.getPayload();
    if (!payload) {
      console.error('Invalid token payload');
      res.status(401).json({
        error: 'Authentication failed',
        details: 'Invalid token payload'
      });
      return;
    }

    console.log('Token verified, processing user data...');
    const { email, given_name, family_name, picture, sub: googleId } = payload;

    if (!email) {
      console.error('No email in payload');
      res.status(401).json({
        error: 'Authentication failed',
        details: 'No email provided in token payload'
      });
      return;
    }

    // Find existing user or create new one
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('Creating new user...');
      user = await User.create({
        email,
        firstName: given_name || '',
        lastName: family_name || '',
        profilePicture: picture,
        googleId,
        role: 'user'
      });
    } else {
      console.log('Updating existing user...');
      user.firstName = given_name || user.firstName;
      user.lastName = family_name || user.lastName;
      user.profilePicture = picture || user.profilePicture;
      user.googleId = googleId;
      await user.save();
    }

    // Generate JWT token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    console.log('Authentication successful');
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
    console.error('Authentication error:', error);
    res.status(401).json({
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const validateToken = async (req: Request, res: Response): Promise<void> => {
  try {
    console.log('Validating token...');
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.error('No token provided');
      res.status(401).json({
        error: 'Invalid token',
        details: 'No token provided'
      });
      return;
    }

    console.log('Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { id: string };
    
    console.log('Finding user...');
    const user = await User.findById(decoded.id);

    if (!user) {
      console.error('User not found');
      res.status(401).json({
        error: 'Invalid token',
        details: 'User not found'
      });
      return;
    }

    console.log('Token validation successful');
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
