import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { Team } from '../models/Team';

const teamsRouter = require('../routes/teams').default as express.Router;

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/teams', teamsRouter);

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

const buildTeam = (overrides: Record<string, any> = {}) => ({
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

describe('Teams API', () => {
  let app: express.Application;
  let testTeams: any[] = [];

  beforeAll(() => {
    app = createTestApp();
  });

  beforeEach(async () => {
    // Create test teams for different groups
    testTeams = await Promise.all([
      Team.create(buildTeam({ name: 'Egypt', group: 'A', shortCode: 'EGY' })),
      Team.create(buildTeam({ name: 'Nigeria', group: 'A', shortCode: 'NGR' })),
      Team.create(buildTeam({ name: 'Ivory Coast', group: 'A', shortCode: 'CIV' })),
      Team.create(buildTeam({ name: 'Guinea', group: 'A', shortCode: 'GUI' })),
      Team.create(buildTeam({ name: 'Cameroon', group: 'B', shortCode: 'CMR' })),
      Team.create(buildTeam({ name: 'Senegal', group: 'B', shortCode: 'SEN' })),
    ]);
  });

  describe('GET /api/teams', () => {
    it('should return all teams with pagination', async () => {
      const response = await request(app)
        .get('/api/teams')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(6);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.total).toBe(6);
      expect(response.body.pagination.limit).toBe(20);
      expect(response.body.pagination.offset).toBe(0);
      expect(response.body.pagination.hasMore).toBe(false);

      // Check response format
      const team = response.body.data[0];
      expect(team).toHaveProperty('id');
      expect(team).toHaveProperty('name');
      expect(team).toHaveProperty('shortCode');
      expect(team).toHaveProperty('flagUrl');
      expect(team).toHaveProperty('group');
      expect(team).toHaveProperty('stats');
      expect(team).toHaveProperty('colors');
      expect(team).toHaveProperty('city');
      expect(team).toHaveProperty('squad');
      expect(team.stats).toHaveProperty('wins');
      expect(team.stats).toHaveProperty('losses');
      expect(team.stats).toHaveProperty('draws');
    });

    it('should filter teams by group', async () => {
      const response = await request(app)
        .get('/api/teams?group=A')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(4);
      expect(response.body.data.every((team: any) => team.group === 'A')).toBe(true);
    });

    it('should search teams by name', async () => {
      const response = await request(app)
        .get('/api/teams?search=Egypt')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Egypt');
    });

    it('should handle case-insensitive search', async () => {
      const response = await request(app)
        .get('/api/teams?search=EGYPT')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.data[0].name).toBe('Egypt');
    });

    it('should paginate results', async () => {
      const response = await request(app)
        .get('/api/teams?limit=2&offset=0')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination.limit).toBe(2);
      expect(response.body.pagination.offset).toBe(0);
      expect(response.body.pagination.hasMore).toBe(true);
    });

    it('should return 400 for invalid group parameter', async () => {
      const response = await request(app)
        .get('/api/teams?group=Z')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid group parameter');
    });

    it('should limit pagination to maximum 100', async () => {
      const response = await request(app)
        .get('/api/teams?limit=200')
        .expect(200);

      expect(response.body.pagination.limit).toBe(100);
    });

    it('should set cache headers', async () => {
      const response = await request(app)
        .get('/api/teams')
        .expect(200);

      expect(response.headers['cache-control']).toBe('public, max-age=86400');
    });
  });

  describe('GET /api/teams/:id', () => {
    it('should return a team by valid ID', async () => {
      const team = testTeams[0];
      const response = await request(app)
        .get(`/api/teams/${team._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.id).toBe(team._id.toString());
      expect(response.body.data.name).toBe(team.name);
      expect(response.body.data.shortCode).toBe(team.shortCode);
      expect(response.body.data.group).toBe(team.group);
    });

    it('should return 404 for non-existent team ID', async () => {
      const fakeId = new mongoose.Types.ObjectId();
      const response = await request(app)
        .get(`/api/teams/${fakeId}`)
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Team not found');
    });

    it('should return 400 for invalid ID format', async () => {
      const response = await request(app)
        .get('/api/teams/invalid-id')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Invalid team ID format');
    });

    it('should set cache headers', async () => {
      const team = testTeams[0];
      const response = await request(app)
        .get(`/api/teams/${team._id}`)
        .expect(200);

      expect(response.headers['cache-control']).toBe('public, max-age=86400');
    });
  });

  describe('GET /api/teams/group/:group', () => {
    it('should return teams for a valid group', async () => {
      const response = await request(app)
        .get('/api/teams/group/A')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(4);
      expect(response.body.data.every((team: any) => team.group === 'A')).toBe(true);
      expect(response.body.count).toBe(4);
    });

    it('should return teams for group B', async () => {
      const response = await request(app)
        .get('/api/teams/group/B')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((team: any) => team.group === 'B')).toBe(true);
      expect(response.body.count).toBe(2);
    });

    it('should handle case-insensitive group parameter', async () => {
      const response = await request(app)
        .get('/api/teams/group/a')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(4);
      expect(response.body.data.every((team: any) => team.group === 'A')).toBe(true);
    });

    it('should return 400 for invalid group', async () => {
      const response = await request(app)
        .get('/api/teams/group/Z')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid group parameter');
    });

    it('should return 400 for group outside A-F range', async () => {
      const response = await request(app)
        .get('/api/teams/group/G')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid group parameter');
    });

    it('should set cache headers', async () => {
      const response = await request(app)
        .get('/api/teams/group/A')
        .expect(200);

      expect(response.headers['cache-control']).toBe('public, max-age=86400');
    });
  });

  describe('Response Format', () => {
    it('should include all required fields in team response', async () => {
      const team = testTeams[0];
      const response = await request(app)
        .get(`/api/teams/${team._id}`)
        .expect(200);

      const teamData = response.body.data;
      expect(teamData).toHaveProperty('id');
      expect(teamData).toHaveProperty('name');
      expect(teamData).toHaveProperty('shortCode');
      expect(teamData).toHaveProperty('flagUrl');
      expect(teamData).toHaveProperty('group');
      expect(teamData).toHaveProperty('stats');
      expect(teamData).toHaveProperty('colors');
      expect(teamData).toHaveProperty('city');
      expect(teamData).toHaveProperty('squad');

      expect(teamData.stats).toHaveProperty('wins');
      expect(teamData.stats).toHaveProperty('losses');
      expect(teamData.stats).toHaveProperty('draws');
      expect(teamData.stats).toHaveProperty('goalsFor');
      expect(teamData.stats).toHaveProperty('goalsAgainst');

      expect(teamData.colors).toHaveProperty('primary');
      expect(teamData.colors).toHaveProperty('secondary');

      expect(Array.isArray(teamData.squad)).toBe(true);
    });

    it('should handle teams with missing optional fields', async () => {
      const teamWithoutOptional = await Team.create({
        name: 'Minimal Team',
        nameAr: 'فريق بسيط',
        nameFr: 'Équipe Simple',
        slug: 'minimal-team',
        shortCode: 'MIN',
        flagUrl: 'https://flagcdn.com/w320/min.png',
        group: 'C',
        city: 'Minimal City',
        cityAr: 'مدينة بسيطة',
        cityFr: 'Ville Simple',
      });

      const response = await request(app)
        .get(`/api/teams/${teamWithoutOptional._id}`)
        .expect(200);

      const teamData = response.body.data;
      expect(teamData.stats).toEqual({
        wins: 0,
        losses: 0,
        draws: 0,
        goalsFor: 0,
        goalsAgainst: 0,
      });
      expect(teamData.colors).toEqual({ primary: '', secondary: '' });
      expect(teamData.squad).toEqual([]);
    });
  });
});