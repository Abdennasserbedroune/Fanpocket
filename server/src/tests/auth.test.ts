import request from 'supertest';
import createTestApp from './testApp';
import { User } from '../models/User';
import { hashPassword } from '../utils/auth';

describe('Authentication Endpoints', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
    displayName: 'Test User',
  };

  describe('POST /api/auth/register', () => {
    it('should register a new user successfully', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/register')
        .send(testUser)
        .expect(201);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.username).toBe(testUser.username);
      expect(response.body.data.user.password).toBeUndefined();
      expect(response.body.data.user.refreshTokens).toBeUndefined();

      // Check if cookies are set
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access-token');
      expect(response.headers['set-cookie'][1]).toContain('refresh-token');
    });

    it('should return error for duplicate email', async () => {
      const app = createTestApp();
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Try to create second user with same email
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          username: 'differentuser',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Email already registered');
    });

    it('should return error for duplicate username', async () => {
      const app = createTestApp();
      // Create first user
      await request(app)
        .post('/api/auth/register')
        .send(testUser);

      // Try to create second user with same username
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'different@example.com',
        })
        .expect(409);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Username already taken');
    });

    it('should return error for invalid email format', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          email: 'invalid-email',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid email format');
    });

    it('should return error for short password', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          ...testUser,
          password: '123',
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Password must be at least 6 characters');
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      // Create a test user
      const hashedPassword = await hashPassword(testUser.password);
      await User.create({
        ...testUser,
        password: hashedPassword,
      });
    });

    it('should login successfully with valid credentials', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: testUser.password,
        })
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.password).toBeUndefined();

      // Check if cookies are set
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access-token');
      expect(response.headers['set-cookie'][1]).toContain('refresh-token');
    });

    it('should return error for invalid email', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'wrong@example.com',
          password: testUser.password,
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should return error for invalid password', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: testUser.email,
          password: 'wrongpassword',
        })
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid credentials');
    });

    it('should return error for missing email', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          password: testUser.password,
        })
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid input');
    });
  });

  describe('GET /api/auth/me', () => {
    let accessToken: string;

    beforeEach(async () => {
      const app = createTestApp();
      // Register and login to get access token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const cookies = registerResponse.headers['set-cookie'];
      accessToken = cookies[0].split(';')[0].split('=')[1];
    });

    it('should return user profile with valid access token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);
      expect(response.body.data.user.password).toBeUndefined();
    });

    it('should return error without access token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/auth/me')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });

    it('should return error with invalid access token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid or expired token');
    });
  });

  describe('POST /api/auth/refresh', () => {
    let refreshToken: string;

    beforeEach(async () => {
      const app = createTestApp();
      // Register to get refresh token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const cookies = registerResponse.headers['set-cookie'];
      refreshToken = cookies[1].split(';')[0].split('=')[1];
    });

    it('should refresh tokens successfully', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', `refresh-token=${refreshToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.user.email).toBe(testUser.email);

      // Check if new cookies are set
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access-token');
      expect(response.headers['set-cookie'][1]).toContain('refresh-token');
    });

    it('should return error without refresh token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/refresh')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Refresh token required');
    });

    it('should return error with invalid refresh token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', 'refresh-token=invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid or expired refresh token');
    });
  });

  describe('POST /api/auth/logout', () => {
    let accessToken: string;
    let refreshToken: string;

    beforeEach(async () => {
      const app = createTestApp();
      // Register to get tokens
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const cookies = registerResponse.headers['set-cookie'];
      accessToken = cookies[0].split(';')[0].split('=')[1];
      refreshToken = cookies[1].split(';')[0].split('=')[1];
    });

    it('should logout successfully', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Authorization', `Bearer ${accessToken}`)
        .set('Cookie', `refresh-token=${refreshToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('Logged out successfully');

      // Check if cookies are cleared
      expect(response.headers['set-cookie']).toBeDefined();
      expect(response.headers['set-cookie'][0]).toContain('access-token=;');
      expect(response.headers['set-cookie'][1]).toContain('refresh-token=;');
    });

    it('should return error without access token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .post('/api/auth/logout')
        .set('Cookie', `refresh-token=${refreshToken}`)
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });
  });

  describe('Token Rotation', () => {
    let app: any;
    let refreshToken: string;

    beforeEach(async () => {
      app = createTestApp();
      // Register to get refresh token
      const registerResponse = await request(app)
        .post('/api/auth/register')
        .send(testUser);

      const cookies = registerResponse.headers['set-cookie'];
      refreshToken = cookies[1].split(';')[0].split('=')[1];
    });

    it('should rotate refresh token on use', async () => {
      // First refresh
      const firstRefreshResponse = await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', `refresh-token=${refreshToken}`)
        .expect(200);

      const firstCookies = firstRefreshResponse.headers['set-cookie'];
      const newRefreshToken = firstCookies[1].split(';')[0].split('=')[1];

      // Try to use the old token again (should fail)
      await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', `refresh-token=${refreshToken}`)
        .expect(401);

      // Use the new token (should succeed)
      await request(app)
        .post('/api/auth/refresh')
        .set('Cookie', `refresh-token=${newRefreshToken}`)
        .expect(200);
    });
  });
});