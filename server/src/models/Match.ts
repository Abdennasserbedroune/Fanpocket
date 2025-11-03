import mongoose, { Schema, Document, Types } from 'mongoose';
import { Match as IMatch } from '@fanpocket/shared';

export interface MatchDocument
  extends Omit<IMatch, 'id' | 'homeTeam' | 'awayTeam' | 'stadium'>,
    Document {
  homeTeam: Types.ObjectId;
  awayTeam: Types.ObjectId;
  stadium: Types.ObjectId;
}

const MatchSchema = new Schema<MatchDocument>(
  {
    matchNumber: {
      type: Number,
      required: true,
      unique: true,
    },
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
    stage: {
      type: String,
      enum: ['group', 'r16', 'quarter', 'semi', 'final'],
      required: true,
    },
    group: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F'],
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
    events: [
      {
        type: String,
        minute: Number,
        player: String,
        team: String,
        description: String,
      },
    ],
  },
  {
    timestamps: true,
  }
);

MatchSchema.index({ matchNumber: 1 });
MatchSchema.index({ dateTime: 1, stadium: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ stage: 1 });
MatchSchema.index({ group: 1 });
MatchSchema.index({ homeTeam: 1, awayTeam: 1 });

export const Match = mongoose.model<MatchDocument>('Match', MatchSchema);
