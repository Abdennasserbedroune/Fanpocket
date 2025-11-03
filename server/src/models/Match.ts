import mongoose, { Schema, Document } from 'mongoose';
import { Match as IMatch } from '@fanpocket/shared';

export interface MatchDocument extends Omit<IMatch, 'id'>, Document {}

const MatchSchema = new Schema<MatchDocument>(
  {
    homeTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    awayTeam: {
      type: Schema.Types.ObjectId,
      ref: 'Team',
      required: true,
    },
    stadium: {
      type: Schema.Types.ObjectId,
      ref: 'Stadium',
      required: true,
    },
    competition: {
      type: String,
      required: true,
    },
    dateTime: {
      type: Date,
      required: true,
    },
    status: {
      type: String,
      enum: ['scheduled', 'live', 'finished', 'postponed', 'cancelled'],
      default: 'scheduled',
    },
    score: {
      home: Number,
      away: Number,
      halfTime: {
        home: Number,
        away: Number,
      },
    },
    attendance: Number,
    ticketInfo: {
      available: Boolean,
      url: String,
      priceRange: {
        min: Number,
        max: Number,
        currency: String,
      },
    },
    broadcast: {
      tv: [String],
      streaming: [String],
    },
    weather: {
      condition: String,
      temperature: Number,
    },
  },
  {
    timestamps: true,
  }
);

MatchSchema.index({ dateTime: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ homeTeam: 1, awayTeam: 1 });

export const Match = mongoose.model<MatchDocument>('Match', MatchSchema);
