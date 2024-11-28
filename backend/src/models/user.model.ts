import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import validator from 'validator';

interface IUser extends mongoose.Document {
  email: string;
  password?: string;
  firstName: string;
  lastName: string;
  darkMode: boolean;
  authProvider: string;
  googleId?: string;
  profilePicture?: string;
  role: string;
  comparePassword(candidatePassword: string): Promise<boolean>;
}

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, 'Please provide your email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: false,
      minlength: 8,
      select: false,
    },
    firstName: {
      type: String,
      default: '',
    },
    lastName: {
      type: String,
      default: '',
    },
    darkMode: {
      type: Boolean,
      default: false,
    },
    role: {
      type: String,
      enum: ['host', 'admin'],
      default: 'host',
    },
    authProvider: {
      type: String,
      enum: ['local', 'google', 'apple'],
      default: 'local',
    },
    googleId: {
      type: String,
    },
    profilePicture: {
      type: String,
    },
  },
  {
    timestamps: true,
    toJSON: {
      transform(_doc, ret) {
        delete ret.password;
        return ret;
      },
    },
  }
);

// Hash password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password!, salt);
    next();
  } catch (error: any) {
    next(error);
  }
});

// Compare password method
userSchema.methods.comparePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  try {
    return await bcrypt.compare(candidatePassword, this.password);
  } catch (error) {
    throw new Error('Error comparing passwords');
  }
};

export const User = mongoose.model<IUser>('User', userSchema);
