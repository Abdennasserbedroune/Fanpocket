import mongoose from 'mongoose';

beforeAll(async () => {
  // Connect to test database
  const testUri = process.env.MONGODB_URI?.replace('/fanpocket', '/fanpocket-test') || 
                  'mongodb://admin:admin123@localhost:27017/fanpocket-test?authSource=admin';
  await mongoose.connect(testUri);
});

afterAll(async () => {
  // Clean up database connection
  await mongoose.connection.close();
});

beforeEach(async () => {
  // Clean up all collections before each test
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});