import mongoose, { Schema, Document } from 'mongoose';

export interface NotificationDocument extends Document {
  type: string;
  payload: Record<string, any>;
  createdAt: Date;
}

const NotificationSchema = new Schema<NotificationDocument>(
  {
    type: {
      type: String,
      required: true,
    },
    payload: {
      type: Schema.Types.Mixed,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

NotificationSchema.index({ type: 1 });
NotificationSchema.index({ createdAt: -1 });

export const Notification = mongoose.model<NotificationDocument>(
  'Notification',
  NotificationSchema
);
