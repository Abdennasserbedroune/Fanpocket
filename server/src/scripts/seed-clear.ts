import mongoose from 'mongoose';
import { config } from '../config';
import { Team } from '../models/Team';
import { Stadium } from '../models/Stadium';
import { Match } from '../models/Match';

const clearDatabase = async () => {
  try {
    console.log('Connecting to database...');
    await mongoose.connect(config.mongoUri);
    console.log('✅ Connected to database');

    console.log('Clearing existing data...');
    await Team.deleteMany({});
    await Stadium.deleteMany({});
    await Match.deleteMany({});
    console.log(
      '✅ Cleared all data from teams, stadiums, and matches collections'
    );

    console.log('🎉 Database cleared successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Clear failed:', error);
    process.exit(1);
  }
};

clearDatabase();
