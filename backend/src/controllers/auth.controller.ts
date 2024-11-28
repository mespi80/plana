import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { OAuth2Client } from 'google-auth-library';
import { User } from '../models/user.model';
import { AuthError } from '../types/errors';

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleAuth = async (req: Request, res: Response) => {
  try {
    console.log('Starting Google authentication...');
    const { credential } = req.body;
    
    if (!credential) {
      console.error('No credential provided');
      return res.status(400).json({ 
        error: 'Authentication failed',
        details: 'No credential provided'
      });
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
      throw new AuthError('Invalid token payload');
    }

    console.log('Token verified, processing user data...');
    const { email, given_name, family_name, picture, sub: googleId } = payload;

    if (!email) {
      console.error('No email in payload');
      throw new AuthError('No email provided in token payload');
    }

    // Find or create user
    let user = await User.findOne({ email });
    
    if (!user) {
      console.log('Creating new user...');
      user = await User.create({
        email,
        firstName: given_name || '',
        lastName: family_name || '',
        profilePicture: picture,
        authProvider: 'google',
        googleId,
        role: 'host'
      });
    } else {
      console.log('Updating existing user...');
      // Update existing user's information
      user.firstName = given_name || user.firstName;
      user.lastName = family_name || user.lastName;
      user.profilePicture = picture || user.profilePicture;
      user.googleId = googleId;
      await user.save();
    }

    console.log('Generating JWT token...');
    // Generate JWT token
    const token = jwt.sign(
      { userId: user._id },
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
    console.error('Google auth error:', error);
    res.status(401).json({ 
      error: 'Authentication failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
};

export const validateToken = async (req: Request, res: Response) => {
  try {
    console.log('Validating token...');
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      console.error('No token provided');
      throw new AuthError('No token provided');
    }

    console.log('Verifying JWT token...');
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
    
    console.log('Finding user...');
    const user = await User.findById(decoded.userId);

    if (!user) {
      console.error('User not found');
      throw new AuthError('User not found');
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
