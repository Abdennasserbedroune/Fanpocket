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
    logo: {
      type: String,
      required: true,
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
  },
  {
    timestamps: true,
  }
);

TeamSchema.index({ slug: 1 });
TeamSchema.index({ city: 1 });

export const Team = mongoose.model<TeamDocument>('Team', TeamSchema);
