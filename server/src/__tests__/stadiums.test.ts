import request from 'supertest';
import express from 'express';
import mongoose from 'mongoose';
import { Team } from '../models/Team';
import { Stadium } from '../models/Stadium';
import { Match } from '../models/Match';

jest.mock('node-fetch', () => ({
  __esModule: true,
  default: jest.fn(),
}));

import fetch from 'node-fetch';

const stadiumsRouter = require('../routes/stadiums').default as express.Router;
const geocodeModule = require('../routes/geocode') as {
  default: express.Router;
  __clearGeocodeCache: () => void;
};

const geocodeRouter = geocodeModule.default;
const { __clearGeocodeCache } = geocodeModule;

const mockedFetch = fetch as jest.MockedFunction<typeof fetch>;

const createTestApp = () => {
  const app = express();
  app.use(express.json());
  app.use('/api/stadiums', stadiumsRouter);
  app.use('/api/geocode', geocodeRouter);

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

const buildStadium = (overrides: Record<string, any> = {}) => ({
  name: 'Test Stadium',
  nameAr: 'ملعب الاختبار',
  nameFr: 'Stade Test',
  shortName: 'Test',
  slug: `stadium-${Math.random().toString(16).slice(2)}`,
  city: 'Rabat',
  cityAr: 'الرباط',
  cityFr: 'Rabat',
  location: {
    type: 'Point' as const,
    coordinates: [-6.85, 33.97],
  },
  address: '123 Test Street',
  addressAr: '123 شارع الاختبار',
  addressFr: '123 Rue Test',
  capacity: 50000,
  facilities: ['Parking', 'Food Courts'],
  transport: ['Bus', 'Taxi'],
  nearbyAttractions: ['Test Museum'],
  accessibility: {
    parking: true,
    publicTransport: true,
    wheelchairAccessible: true,
  },
  ...overrides,
});

const buildTeam = (overrides: Record<string, any> = {}) => ({
  name: 'Morocco',
  nameAr: 'المغرب',
  nameFr: 'Maroc',
  slug: `team-${Math.random().toString(16).slice(2)}`,
  shortCode: 'MAR',
  flagUrl: 'https://flagcdn.com/w320/ma.png',
  group: 'A',
  city: 'Rabat',
  cityAr: 'الرباط',
  cityFr: 'Rabat',
  ...overrides,
});

describe('Stadiums API', () => {
  let team1: mongoose.Document;
  let team2: mongoose.Document;
  let stadiumRabat: mongoose.Document;
  let stadiumCasablanca: mongoose.Document;

  beforeEach(async () => {
    mockedFetch.mockReset();
    __clearGeocodeCache();

    team1 = await Team.create(buildTeam({
      name: 'Morocco',
      shortCode: 'MAR',
      slug: 'morocco',
    }));

    team2 = await Team.create(buildTeam({
      name: 'Egypt',
      nameAr: 'مصر',
      nameFr: 'Égypte',
      shortCode: 'EGY',
      slug: 'egypt',
      flagUrl: 'https://flagcdn.com/w320/eg.png',
      city: 'Cairo',
      cityAr: 'القاهرة',
      cityFr: 'Le Caire',
    }));

    stadiumRabat = await Stadium.create(
      buildStadium({
        name: 'Prince Moulay Abdellah Stadium',
        slug: 'prince-moulay-abdellah',
        location: {
          type: 'Point',
          coordinates: [-6.8498, 33.9723],
        },
      })
    );

    stadiumCasablanca = await Stadium.create(
      buildStadium({
        name: 'Stade Mohammed V',
        slug: 'stade-mohammed-v',
        city: 'Casablanca',
        cityAr: 'الدار البيضاء',
        cityFr: 'Casablanca',
        location: {
          type: 'Point',
          coordinates: [-7.6298, 33.5731],
        },
      })
    );

    const futureDate = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000);
    const pastDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

    await Match.create({
      matchNumber: 1,
      homeTeam: team1._id,
      awayTeam: team2._id,
      stadium: stadiumRabat._id,
      stage: 'group',
      group: 'A',
      dateTime: futureDate,
      status: 'scheduled',
    });

    await Match.create({
      matchNumber: 2,
      homeTeam: team2._id,
      awayTeam: team1._id,
      stadium: stadiumRabat._id,
      stage: 'group',
      group: 'A',
      dateTime: pastDate,
      status: 'finished',
      score: { home: 2, away: 1 },
    });
  });

  afterEach(async () => {
    await Match.deleteMany({});
    await Stadium.deleteMany({});
    await Team.deleteMany({});
    __clearGeocodeCache();
  });

  describe('GET /api/stadiums', () => {
    it('returns all stadiums with upcoming matches', async () => {
      const app = createTestApp();
      const response = await request(app).get('/api/stadiums').expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data[0]).toHaveProperty('upcomingMatches');

      const rabatEntry = response.body.data.find(
        (entry: any) => entry.slug === 'prince-moulay-abdellah'
      );

      expect(rabatEntry).toBeDefined();
      expect(rabatEntry.upcomingMatches).toHaveLength(1);
      expect(rabatEntry.upcomingMatches[0].homeTeam.name).toBe('Morocco');
    });

    it('filters by city query parameter', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/stadiums?city=Rabat')
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].city).toBe('Rabat');
    });

    it('returns 400 for invalid city filter', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/stadiums?city=InvalidCity')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid city');
    });
  });

  describe('GET /api/stadiums/city/:city', () => {
    it('returns stadiums for a valid city', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/stadiums/city/rabat')
        .expect(200);

      expect(response.body.count).toBe(1);
      expect(response.body.data[0].city).toBe('Rabat');
    });

    it('returns 400 for invalid city parameter', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/stadiums/city/unknown')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Invalid city');
    });
  });

  describe('GET /api/stadiums/:id', () => {
    it('returns stadium details with upcoming and recent matches', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get(`/api/stadiums/${stadiumRabat._id}`)
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.data.upcomingMatches).toHaveLength(1);
      expect(response.body.data.recentMatches).toHaveLength(1);
      expect(response.body.data.upcomingMatches[0]).toHaveProperty('homeTeam');
    });

    it('returns 404 for non-existent stadium', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/stadiums/123456789012345678901234')
        .expect(404);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toBe('Stadium not found');
    });
  });

  describe('GET /api/stadiums/nearby', () => {
    it('returns stadiums sorted by distance with computed distance', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/stadiums/nearby?lat=33.97&lng=-6.85&radius=500')
        .expect(200);

      expect(response.body.success).toBe(true);
      expect(response.body.count).toBe(2);
      expect(response.body.data[0].distanceInKm).toBeLessThanOrEqual(1);
      expect(response.body.data[0].slug).toBe('prince-moulay-abdellah');
    });

    it('returns 400 when coordinates are missing', async () => {
      const app = createTestApp();
      const response = await request(app)
        .get('/api/stadiums/nearby')
        .expect(400);

      expect(response.body.success).toBe(false);
      expect(response.body.error).toContain('Latitude and longitude');
    });
  });
});

describe('Geocode API', () => {
  beforeEach(() => {
    mockedFetch.mockReset();
    __clearGeocodeCache();
  });

  it('returns geocoding results and caches them', async () => {
    mockedFetch.mockResolvedValue({
      ok: true,
      json: async () => [
        {
          display_name: 'Marrakesh, Morocco',
          lat: '31.6295',
          lon: '-7.9811',
          boundingbox: ['31.5', '31.7', '-8.1', '-7.9'],
          type: 'city',
          importance: 0.8,
        },
      ],
    } as any);

    const app = createTestApp();

    const firstResponse = await request(app)
      .get('/api/geocode?address=Marrakesh')
      .expect(200);

    expect(firstResponse.body.success).toBe(true);
    expect(firstResponse.body.cached).toBe(false);
    expect(firstResponse.body.data[0].displayName).toContain('Marrakesh');
    expect(mockedFetch).toHaveBeenCalledTimes(1);

    const cachedResponse = await request(app)
      .get('/api/geocode?address=Marrakesh')
      .expect(200);

    expect(cachedResponse.body.cached).toBe(true);
    expect(mockedFetch).toHaveBeenCalledTimes(1);
  });

  it('returns 400 when address is missing', async () => {
    const app = createTestApp();
    const response = await request(app).get('/api/geocode').expect(400);

    expect(response.body.success).toBe(false);
    expect(response.body.error).toContain('Address');
  });
});
