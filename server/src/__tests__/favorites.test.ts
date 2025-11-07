import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { config } from '../config';
import favoritesRouter from '../routes/favorites';
import authRouter from '../routes/auth';

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/favorites', favoritesRouter);
  app.use('/api/auth', authRouter);

  app.use(
    (err: any, req: express.Request, res: express.Response, _next: express.NextFunction) => {
      console.error('Test error:', err);
      res.status(500).json({
        success: false,
        error: err?.message ?? 'Internal server error',
      });
    }
  );

  return app;
};

const createTestUser = async () => {
  const hashedPassword = await bcrypt.hash('password123', 12);
  const user = new User({
    email: 'test@example.com',
    username: 'testuser',
    password: hashedPassword,
    displayName: 'Test User',
    locale: 'en',
    favoriteTeams: [],
    favoriteStadiums: [],
  });
  await user.save();
  return user;
};

const createTestTeam = async (overrides: Record<string, any> = {}) => {
  const team = new Team({
    name: 'Test Team',
    nameAr: 'فريق الاختبار',
    nameFr: 'Équipe Test',
    slug: `team-${Math.random().toString(16).slice(2)}`,
    shortCode: 'TT',
    flagUrl: 'https://flagcdn.com/w320/tt.png',
    group: 'A',
    city: 'Test City',
    cityAr: 'مدينة الاختبار',
    cityFr: 'Ville Test',
    colors: {
      primary: '#FF0000',
      secondary: '#0000FF',
    },
    stats: {
      played: 0,
      won: 0,
      drawn: 0,
      lost: 0,
      goalsFor: 0,
      goalsAgainst: 0,
      points: 0,
    },
    squad: [],
    ...overrides,
  });
  await team.save();
  return team;
};

const generateAuthToken = (userId: string) => {
  return jwt.sign({ userId }, config.jwt.secret, {
    expiresIn: config.jwt.expire,
  } as jwt.SignOptions);
};

describe('Favorites API', () => {
  let app: express.Application;
  let testUser: any;
  let authToken: string;
  let testTeam: any;

  beforeAll(async () => {
    app = createTestApp();
  });

  beforeEach(async () => {
    testUser = await createTestUser();
    testTeam = await createTestTeam();
    authToken = generateAuthToken(testUser.id);
  });

  describe('POST /api/favorites/:teamId', () => {
    it('should add team to favorites successfully', async () => {
      const response = await request(app)
        .post(`/api/favorites/${testTeam.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('favoriteTeams');
      expect(response.body.favoriteTeams).toContainEqual(
        expect.objectContaining({
          _id: testTeam.id,
          name: testTeam.name,
          shortCode: testTeam.shortCode,
        })
      );
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app)
        .post(`/api/favorites/${testTeam.id}`)
        .expect(401);
    });

    it('should return 400 for invalid team ID', async () => {
      const response = await request(app)
        .post('/api/favorites/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.message).toBe('Invalid team ID');
    });

    it('should return 404 for non-existent team', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .post(`/api/favorites/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Team not found');
    });

    it('should return 400 if team already in favorites', async () => {
      // Add team to favorites first
      testUser.favoriteTeams.push(testTeam.id);
      await testUser.save();

      const response = await request(app)
        .post(`/api/favorites/${testTeam.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.message).toBe('Team already in favorites');
    });
  });

  describe('DELETE /api/favorites/:teamId', () => {
    beforeEach(async () => {
      // Add team to favorites for delete tests
      testUser.favoriteTeams.push(testTeam.id);
      await testUser.save();
    });

    it('should remove team from favorites successfully', async () => {
      const response = await request(app)
        .delete(`/api/favorites/${testTeam.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toHaveProperty('favoriteTeams');
      expect(response.body.favoriteTeams).not.toContainEqual(
        expect.objectContaining({
          _id: testTeam.id,
        })
      );
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app)
        .delete(`/api/favorites/${testTeam.id}`)
        .expect(401);
    });

    it('should return 400 for invalid team ID', async () => {
      const response = await request(app)
        .delete('/api/favorites/invalid-id')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(400);

      expect(response.body.message).toBe('Invalid team ID');
    });

    it('should return 404 for non-existent team', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .delete(`/api/favorites/${fakeId}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Team not found');
    });

    it('should return 404 if team not in favorites', async () => {
      // Remove team from favorites first
      testUser.favoriteTeams = [];
      await testUser.save();

      const response = await request(app)
        .delete(`/api/favorites/${testTeam.id}`)
        .set('Authorization', `Bearer ${authToken}`)
        .expect(404);

      expect(response.body.message).toBe('Team not in favorites');
    });
  });

  describe('GET /api/favorites', () => {
    it('should return empty array for user with no favorites', async () => {
      const response = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body).toEqual([]);
    });

    it('should return user favorite teams with full details', async () => {
      // Add team to favorites
      testUser.favoriteTeams.push(testTeam.id);
      await testUser.save();

      const response = await request(app)
        .get('/api/favorites')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(1);
      const team = response.body[0];
      expect(team.name).toBe(testTeam.name);
      expect(team.nameAr).toBe(testTeam.nameAr);
      expect(team.nameFr).toBe(testTeam.nameFr);
      expect(team.shortCode).toBe(testTeam.shortCode);
      expect(team.flagUrl).toBe(testTeam.flagUrl);
      expect(team.group).toBe(testTeam.group);
      expect(team.city).toBe(testTeam.city);
      expect(team.cityAr).toBe(testTeam.cityAr);
      expect(team.cityFr).toBe(testTeam.cityFr);
      expect(team.colors).toEqual(testTeam.colors);
      expect(team.slug).toBe(testTeam.slug);
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app)
        .get('/api/favorites')
        .expect(401);
    });
  });
});

describe('Auth API - Updated endpoints', () => {
  let app: express.Application;
  let testUser: any;
  let authToken: string;

  beforeAll(async () => {
    app = createTestApp();
  });

  beforeEach(async () => {
    testUser = await createTestUser();
    authToken = generateAuthToken(testUser.id);
  });

  describe('GET /api/auth/me', () => {
    it('should return user object including favoriteTeams array', async () => {
      const response = await request(app)
        .get('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .expect(200);

      expect(response.body._id).toBe(testUser.id);
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.username).toBe(testUser.username);
      expect(response.body.displayName).toBe(testUser.displayName);
      expect(response.body.favoriteTeams).toEqual([]);
      expect(response.body.favoriteStadiums).toEqual([]);
      expect(response.body.locale).toBe(testUser.locale);
      expect(response.body.notificationPreferences).toEqual(testUser.notificationPreferences);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app)
        .get('/api/auth/me')
        .expect(401);
    });
  });

  describe('PATCH /api/auth/me', () => {
    it('should update user profile successfully', async () => {
      const updateData = {
        displayName: 'Updated Name',
        locale: 'fr',
      };

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.displayName).toBe(updateData.displayName);
      expect(response.body.locale).toBe(updateData.locale);
      expect(response.body).not.toHaveProperty('password');
    });

    it('should update user preferences', async () => {
      const updateData = {
        preferences: {
          matchReminders: false,
          teamNews: true,
        },
      };

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.notificationPreferences.matchReminders).toBe(false);
      expect(response.body.notificationPreferences.teamNews).toBe(true);
      // Should preserve other preferences
      expect(response.body.notificationPreferences.stadiumEvents).toBeDefined();
    });

    it('should update email if unique', async () => {
      const updateData = {
        email: 'newemail@example.com',
      };

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.email).toBe(updateData.email);
    });

    it('should return 400 if email already exists', async () => {
      // Create another user with different email
      const otherUser = new User({
        email: 'other@example.com',
        username: 'otheruser',
        password: await bcrypt.hash('password123', 12),
        displayName: 'Other User',
        locale: 'en',
        favoriteTeams: [],
        favoriteStadiums: [],
      });
      await otherUser.save();

      const updateData = {
        email: 'other@example.com', // Same as other user
      };

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toBe('Email already exists');
    });

    it('should return 400 for invalid locale', async () => {
      const updateData = {
        locale: 'invalid',
      };

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(400);

      expect(response.body.message).toBe('Invalid locale. Must be en, fr, or ar');
    });

    it('should return 401 for unauthenticated requests', async () => {
      await request(app)
        .patch('/api/auth/me')
        .send({ displayName: 'Test' })
        .expect(401);
    });

    it('should allow partial updates', async () => {
      const updateData = {
        displayName: 'Partial Update',
      };

      const response = await request(app)
        .patch('/api/auth/me')
        .set('Authorization', `Bearer ${authToken}`)
        .send(updateData)
        .expect(200);

      expect(response.body.displayName).toBe(updateData.displayName);
      // Other fields should remain unchanged
      expect(response.body.email).toBe(testUser.email);
      expect(response.body.locale).toBe(testUser.locale);
    });
  });
});