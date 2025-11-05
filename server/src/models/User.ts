import mongoose, { Schema, Document } from 'mongoose';
import { User as IUser } from '@fanpocket/shared';

export interface RefreshToken {
  token: string;
  createdAt: Date;
  userAgent?: string;
  ip?: string;
}

export interface UserDocument extends Omit<IUser, 'id'>, Document {
  password: string;
  refreshTokens: RefreshToken[];
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: true,
      select: false,
    },
    refreshTokens: [{
      token: {
        type: String,
        required: true,
      },
      createdAt: {
        type: Date,
        default: Date.now,
      },
      userAgent: String,
      ip: String,
    }],
    displayName: {
      type: String,
      required: true,
    },
    avatar: String,
    favoriteTeams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    favoriteStadiums: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Stadium',
      },
    ],
    notificationPreferences: {
      matchReminders: {
        type: Boolean,
        default: true,
      },
      teamNews: {
        type: Boolean,
        default: true,
      },
      stadiumEvents: {
        type: Boolean,
        default: false,
      },
    },
    locale: {
      type: String,
      enum: ['en', 'fr', 'ar'],
      default: 'en',
    },
  },
  {
    timestamps: true,
  }
);

export const User = mongoose.model<UserDocument>('User', UserSchema);
