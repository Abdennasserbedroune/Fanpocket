import mongoose, { Schema, Document } from 'mongoose';
import { Match as IMatch } from '@fanpocket/shared';

export interface MatchDocument extends Omit<IMatch, 'id'>, Document {}

const MatchSchema = new Schema<MatchDocument>(
  {
    matchNumber: {
      type: Number,
      required: true,
    },
    homeTeam: {
      type: Schema.Types.ObjectId as any,
      ref: 'Team',
      required: function (this: any) {
        return this.stage === 'group';
      },
    },
    awayTeam: {
      type: Schema.Types.ObjectId as any,
      ref: 'Team',
      required: function (this: any) {
        return this.stage === 'group';
      },
    },
    stadium: {
      type: Schema.Types.ObjectId as any,
      ref: 'Stadium',
      required: true,
    },
    competition: String,
    stage: {
      type: String,
      enum: [
        'group',
        'round_of_16',
        'quarter_final',
        'semi_final',
        'third_place',
        'final',
      ],
      required: true,
    },
    group: String,
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
    events: [
      {
        type: {
          type: String,
          enum: ['goal', 'yellow_card', 'red_card', 'substitution'],
          required: true,
        },
        minute: { type: Number, required: true },
        team: { type: String, required: true },
        player: { type: String, required: true },
        details: String,
      },
    ],
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

MatchSchema.index({ matchNumber: 1 }, { unique: true });
MatchSchema.index({ dateTime: 1 });
MatchSchema.index({ stage: 1 });
MatchSchema.index({ group: 1 });
MatchSchema.index({ status: 1 });
MatchSchema.index({ homeTeam: 1 });
MatchSchema.index({ awayTeam: 1 });
MatchSchema.index({ stadium: 1 });

export const Match = mongoose.model<MatchDocument>('Match', MatchSchema);
