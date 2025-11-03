import mongoose from 'mongoose';
import { config } from '../config';
import { Team } from '../models/Team';
import { Stadium } from '../models/Stadium';
import { Match } from '../models/Match';
import { User } from '../models/User';
import { Notification } from '../models/Notification';

const clearDb = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to database');

    console.log('Clearing all collections...');
    await Promise.all([
      Stadium.deleteMany({}),
      Team.deleteMany({}),
      Match.deleteMany({}),
      User.deleteMany({}),
      Notification.deleteMany({}),
    ]);
    console.log('✅ All collections cleared');

    await mongoose.connection.close();
    console.log('🎉 Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Clear failed:', error);
    await mongoose.connection.close();
    process.exit(1);
  }
};

clearDb();
