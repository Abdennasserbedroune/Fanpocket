import dotenv from 'dotenv';

dotenv.config();

export const config = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || 'development',
  mongoUri: process.env.MONGODB_URI || '',
  jwt: {
    secret: process.env.JWT_SECRET || 'fallback-secret-change-in-production',
    expire: process.env.JWT_EXPIRE || '7d',
  },
  cors: {
    origin: process.env.CORS_ORIGIN || 'http://localhost:3000',
  },
  fcm: {
    projectId: process.env.FCM_PROJECT_ID || '',
    privateKey: process.env.FCM_PRIVATE_KEY || '',
    clientEmail: process.env.FCM_CLIENT_EMAIL || '',
  },
};
