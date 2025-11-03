import mongoose, { Schema, Document, Types } from 'mongoose';
import { User as IUser } from '@fanpocket/shared';

export interface UserDocument
  extends Omit<IUser, 'id' | 'favoriteTeams' | 'favoriteStadiums'>,
    Document {
  password: string;
  favoriteTeams: Types.ObjectId[];
  favoriteStadiums: Types.ObjectId[];
}

const UserSchema = new Schema<UserDocument>(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
    },
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
    fcmTokens: [
      {
        type: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

UserSchema.index({ email: 1 });
UserSchema.index({ username: 1 });

export const User = mongoose.model<UserDocument>('User', UserSchema);
