import request from 'supertest';
import createTestApp from './testApp';
import { User } from '../models/User';
import { hashPassword } from '../utils/auth';

describe('Protected Routes', () => {
  const testUser = {
    email: 'test@example.com',
    password: 'password123',
    username: 'testuser',
    displayName: 'Test User',
  };

  let accessToken: string;

  beforeEach(async () => {
    const app = createTestApp();
    // Register and login to get access token
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send(testUser);

    const cookies = registerResponse.headers['set-cookie'];
    if (cookies && cookies[0]) {
      accessToken = cookies[0].split(';')[0].split('=')[1];
    }
  });

  describe('GET /api/protected', () => {
    it('should access protected route with valid token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.message).toContain('protected route');
      expect(response.body.user.email).toBe(testUser.email);
    });

    it('should return error without token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/protected')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });

    it('should return error with invalid token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/protected')
        .set('Authorization', 'Bearer invalid-token')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid or expired token');
    });
  });

  describe('GET /api/protected/admin', () => {
    it('should return error for non-admin user', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/protected/admin')
        .set('Authorization', `Bearer ${accessToken}`)
        .expect(403);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Insufficient permissions');
    });

    it('should return error without token', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/protected/admin')
        .expect(401);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Access token required');
    });
  });
});