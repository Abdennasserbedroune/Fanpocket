import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import matchesRouter from '../routes/matches';
import { Team } from '../models/Team';
import { Stadium } from '../models/Stadium';
import { Match } from '../models/Match';

// Create a test app that only includes the matches router
const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/matches', matchesRouter);
  
  // Add error handling middleware
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Test error:', err);
    res.status(500).json({
      success: false,
      error: err.message || 'Internal server error',
    });
  });
  
  return app;
};

describe('Matches API', () => {
  let team1: any;
  let team2: any;
  let stadium: any;
  let match1: any;
  let match2: any;

  beforeEach(async () => {
    // Create test teams
    team1 = new Team({
      name: 'Morocco',
      shortCode: 'MAR',
      flagUrl: 'https://flagcdn.com/w320/ma.png',
      group: 'A',
      city: 'Rabat',
      slug: 'morocco',
      nameAr: 'المغرب',
      nameFr: 'Maroc',
      cityAr: 'الرباط',
      cityFr: 'Rabat',
    });

    team2 = new Team({
      name: 'Egypt',
      shortCode: 'EGY',
      flagUrl: 'https://flagcdn.com/w320/eg.png',
      group: 'A',
      city: 'Cairo',
      slug: 'egypt',
      nameAr: 'مصر',
      nameFr: 'Égypte',
      cityAr: 'القاهرة',
      cityFr: 'Le Caire',
    });

    await team1.save();
    await team2.save();

    // Create test stadium
    stadium = new Stadium({
      name: 'Prince Moulay Abdellah Stadium',
      city: 'Rabat',
      capacity: 68700,
      location: {
        type: 'Point',
        coordinates: [-6.8545, 34.0133],
      },
      address: 'Rue Al Mokawama, Rabat',
      slug: 'prince-moulay-abdellah-stadium',
      nameAr: 'ملك الأمير عبد الله',
      nameFr: 'Stade Prince Moulay Abdellah',
      addressAr: 'شارع المقاومة، الرباط',
      addressFr: 'Rue Al Mokawama, Rabat',
      cityAr: 'الرباط',
      cityFr: 'Rabat',
    });

    await stadium.save();

    // Create test matches
    const futureDate = new Date();
    futureDate.setDate(futureDate.getDate() + 10);
    
    const pastDate = new Date();
    pastDate.setDate(pastDate.getDate() - 10);

    match1 = new Match({
      matchNumber: 1,
      homeTeam: team1._id,
      awayTeam: team2._id,
      stadium: stadium._id,
      stage: 'group',
      group: 'A',
      dateTime: futureDate,
      status: 'scheduled',
    });

    match2 = new Match({
      matchNumber: 2,
      homeTeam: team2._id,
      awayTeam: team1._id,
      stadium: stadium._id,
      stage: 'group',
      group: 'A',
      dateTime: pastDate,
      status: 'finished',
      score: {
        home: 2,
        away: 1,
      },
    });

    await match1.save();
    await match2.save();
  });

  describe('GET /api/matches', () => {
    it('should return all matches with pagination', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.pagination).toBeDefined();
      expect(response.body.pagination.limit).toBe(20);
      expect(response.body.pagination.offset).toBe(0);
      expect(response.body.pagination.total).toBe(2);
      expect(response.body.pagination.hasMore).toBe(false);

      // Check computed fields
      const match = response.body.data[0];
      expect(match.timeToKickoff).toBeDefined();
      expect(match.hoursUntilMatch).toBeDefined();
      expect(match.matchStatus).toBeDefined();
      expect(match.homeTeam.name).toBeDefined();
      expect(match.awayTeam.name).toBeDefined();
      expect(match.stadium.name).toBeDefined();
    });

    it('should apply pagination correctly', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches?limit=1&offset=0')
        .expect(200);

      expect(response.body.data).toHaveLength(1);
      expect(response.body.pagination.limit).toBe(1);
      expect(response.body.pagination.offset).toBe(0);
      expect(response.body.pagination.hasMore).toBe(true);
    });

    it('should filter by stage', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches?stage=group')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((m: any) => m.stage === 'group')).toBe(true);
    });

    it('should filter by group', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches?group=A')
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((m: any) => m.group === 'A')).toBe(true);
    });

    it('should filter by team', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get(`/api/matches?team=${team1._id}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((m: any) => 
        m.homeTeam._id === team1._id.toString() || m.awayTeam._id === team1._id.toString()
      )).toBe(true);
    });

    it('should filter by stadium', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get(`/api/matches?stadium=${stadium._id}`)
        .expect(200);

      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((m: any) => m.stadium._id === stadium._id.toString())).toBe(true);
    });

    it('should filter by date range', async () => {
      const futureDate = new Date();
      futureDate.setDate(futureDate.getDate() + 5);
      
      const furtherFutureDate = new Date();
      furtherFutureDate.setDate(furtherFutureDate.getDate() + 15);

      const testApp = createTestApp();
      const response = await request(testApp)
        .get(`/api/matches?dateRange=${futureDate.toISOString()},${furtherFutureDate.toISOString()}`)
        .expect(200);

      expect(response.body.data).toHaveLength(1);
    });

    it('should return 400 for invalid stage', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches?stage=invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid stage');
    });

    it('should return 400 for invalid group', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches?group=Z')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid group');
    });

    it('should return 400 for invalid team ID', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches?team=123456789012345678901234')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid team ID');
    });

    it('should return 400 for invalid stadium ID', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches?stadium=123456789012345678901234')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid stadium ID');
    });

    it('should return 400 for invalid date range', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches?dateRange=invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid date range');
    });

    it('should limit pagination correctly', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches?limit=200')
        .expect(200);

      expect(response.body.pagination.limit).toBe(100); // Max limit
    });
  });

  describe('GET /api/matches/:id', () => {
    it('should return a single match with full details', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get(`/api/matches/${match1._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data._id).toBe(match1._id.toString());
      expect(response.body.data.homeTeam.name).toBe('Morocco');
      expect(response.body.data.awayTeam.name).toBe('Egypt');
      expect(response.body.data.stadium.name).toBe('Prince Moulay Abdellah Stadium');
      expect(response.body.data.timeToKickoff).toBeDefined();
      expect(response.body.data.matchStatus).toBeDefined();
    });

    it('should return 404 for non-existent match', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches/123456789012345678901234')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Match not found');
    });
  });

  describe('GET /api/matches/team/:teamId', () => {
    it('should return all matches for a team', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get(`/api/matches/team/${team1._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.all).toHaveLength(2);
      expect(response.body.data.upcoming).toHaveLength(1);
      expect(response.body.data.past).toHaveLength(1);
      expect(response.body.count.total).toBe(2);
      expect(response.body.count.upcoming).toBe(1);
      expect(response.body.count.past).toBe(1);
    });

    it('should return 404 for non-existent team', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches/team/123456789012345678901234')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Team not found');
    });
  });

  describe('GET /api/matches/stadium/:stadiumId', () => {
    it('should return all matches at a stadium', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get(`/api/matches/stadium/${stadium._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.count).toBe(2);
      expect(response.body.data.every((m: any) => m.stadium._id === stadium._id.toString())).toBe(true);
    });

    it('should return 404 for non-existent stadium', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches/stadium/123456789012345678901234')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Stadium not found');
    });
  });

  describe('GET /api/matches/stage/:stage', () => {
    it('should return matches for a valid stage', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches/stage/group')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((m: any) => m.stage === 'group')).toBe(true);
    });

    it('should return 400 for invalid stage', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches/stage/invalid')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid stage');
    });
  });

  describe('GET /api/matches/group/:group', () => {
    it('should return matches for a valid group', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches/group/A')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(2);
      expect(response.body.data.every((m: any) => m.group === 'A')).toBe(true);
    });

    it('should return 400 for invalid group', async () => {
      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches/group/Z')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid group');
    });
  });

  describe('GET /api/matches/today', () => {
    it('should return matches for today', async () => {
      // Create a match for today
      const today = new Date();
      const todayMatch = new Match({
        matchNumber: 3,
        homeTeam: team1._id,
        awayTeam: team2._id,
        stadium: stadium._id,
        stage: 'group',
        group: 'A',
        dateTime: today,
        status: 'scheduled',
      });
      await todayMatch.save();

      const testApp = createTestApp();
      const response = await request(testApp)
        .get('/api/matches/today')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data).toHaveLength(1);
      expect(response.body.count).toBe(1);
    });
  });
});