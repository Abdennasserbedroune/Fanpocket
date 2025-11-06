import mongoose, { Schema, Document } from 'mongoose';
import { Team as ITeam } from '@fanpocket/shared';

export interface TeamDocument extends Omit<ITeam, 'id'>, Document {}

const TeamSchema = new Schema<TeamDocument>(
  {
    name: {
      type: String,
      required: true,
    },
    nameAr: {
      type: String,
      required: true,
    },
    nameFr: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    shortCode: {
      type: String,
      required: true,
    },
    flagUrl: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      required: true,
    },
    logo: String,
    city: {
      type: String,
      required: true,
    },
    cityAr: {
      type: String,
      required: true,
    },
    cityFr: {
      type: String,
      required: true,
    },
    stadium: {
      type: Schema.Types.ObjectId,
      ref: 'Stadium',
    },
    founded: Number,
    colors: {
      primary: String,
      secondary: String,
    },
    league: String,
    stats: {
      played: { type: Number, default: 0 },
      won: { type: Number, default: 0 },
      drawn: { type: Number, default: 0 },
      lost: { type: Number, default: 0 },
      goalsFor: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
      points: { type: Number, default: 0 },
    },
    squad: [
      {
        number: Number,
        name: String,
        position: String,
        age: Number,
        club: String,
      },
    ],
    description: String,
    descriptionAr: String,
    descriptionFr: String,
    website: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
    },
  },
  {
    timestamps: true,
  }
);

TeamSchema.index({ slug: 1 });
TeamSchema.index({ shortCode: 1 }, { unique: true });
TeamSchema.index({ group: 1 });
TeamSchema.index({ city: 1 });

export const Team = mongoose.model<TeamDocument>('Team', TeamSchema);
