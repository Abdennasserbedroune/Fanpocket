import mongoose, { Schema, Document, Types } from 'mongoose';
import { Team as ITeam } from '@fanpocket/shared';

export interface TeamDocument extends Omit<ITeam, 'id' | 'stadium'>, Document {
  stadium?: Types.ObjectId;
}

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
      unique: true,
      uppercase: true,
    },
    flag: {
      type: String,
      required: true,
    },
    logo: {
      type: String,
      required: true,
    },
    group: {
      type: String,
      enum: ['A', 'B', 'C', 'D', 'E', 'F'],
    },
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
    league: {
      type: String,
      required: true,
    },
    description: String,
    descriptionAr: String,
    descriptionFr: String,
    website: String,
    socialMedia: {
      facebook: String,
      twitter: String,
      instagram: String,
    },
    stats: {
      wins: { type: Number, default: 0 },
      draws: { type: Number, default: 0 },
      losses: { type: Number, default: 0 },
      goalsFor: { type: Number, default: 0 },
      goalsAgainst: { type: Number, default: 0 },
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
  },
  {
    timestamps: true,
  }
);

TeamSchema.index({ slug: 1 });
TeamSchema.index({ shortCode: 1 });
TeamSchema.index({ group: 1 });
TeamSchema.index({ city: 1 });

export const Team = mongoose.model<TeamDocument>('Team', TeamSchema);
