import { Request, Response } from 'express';
import { User } from '../models/user.model';

export const updateSettings = async (req: Request, res: Response) => {
  try {
    const userId = req.user.id;
    const { firstName, lastName, darkMode } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      {
        firstName,
        lastName,
        darkMode,
      },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        status: 'error',
        message: 'User not found',
      });
    }

    return res.status(200).json({
      status: 'success',
      data: {
        user,
      },
    });
  } catch (error) {
    return res.status(500).json({
      status: 'error',
      message: 'Error updating user settings',
      error: error instanceof Error ? error.message : 'Unknown error',
    });
  }
};
