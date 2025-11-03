import mongoose, { Schema, Document } from 'mongoose';
import { Stadium as IStadium } from '@fanpocket/shared';

export interface StadiumDocument extends Omit<IStadium, 'id'>, Document {}

const StadiumSchema = new Schema<StadiumDocument>(
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
    location: {
      type: {
        type: String,
        enum: ['Point'],
        required: true,
      },
      coordinates: {
        type: [Number],
        required: true,
      },
    },
    address: {
      type: String,
      required: true,
    },
    addressAr: {
      type: String,
      required: true,
    },
    addressFr: {
      type: String,
      required: true,
    },
    capacity: {
      type: Number,
      required: true,
    },
    opened: Number,
    surface: String,
    homeTeams: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Team',
      },
    ],
    images: [String],
    description: String,
    descriptionAr: String,
    descriptionFr: String,
    facilities: [String],
    accessibility: {
      parking: Boolean,
      publicTransport: Boolean,
      wheelchairAccessible: Boolean,
    },
    contactInfo: {
      phone: String,
      email: String,
      website: String,
    },
  },
  {
    timestamps: true,
  }
);

StadiumSchema.index({ location: '2dsphere' });
StadiumSchema.index({ slug: 1 });
StadiumSchema.index({ city: 1 });

export const Stadium = mongoose.model<StadiumDocument>(
  'Stadium',
  StadiumSchema
);
