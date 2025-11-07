import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { Stadium } from '../models/Stadium';
import { Match } from '../models/Match';

const router = Router();

const ALLOWED_CITIES = ['Rabat', 'Casablanca', 'Marrakesh', 'Agadir', 'Fez', 'Tangier'];
const CITY_ALIASES: Record<string, string> = {
  marrakech: 'Marrakesh',
};

const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

const normaliseId = (value: any): string | undefined => {
  if (!value) {
    return undefined;
  }

  if (typeof value === 'string') {
    return value;
  }

  if (typeof value === 'number') {
    return value.toString();
  }

  if (typeof value === 'object' && typeof value.toString === 'function') {
    return value.toString();
  }

  return undefined;
};

const resolveCity = (value?: string | string[]) => {
  if (!value) {
    return undefined;
  }

  const cityValue = Array.isArray(value) ? value[0] : value;
  if (!cityValue) {
    return undefined;
  }

  const normalised = cityValue.trim().toLowerCase();
  if (!normalised) {
    return undefined;
  }

  if (CITY_ALIASES[normalised]) {
    return CITY_ALIASES[normalised];
  }

  return ALLOWED_CITIES.find(city => city.toLowerCase() === normalised);
};

const handleValidationError = (res: Response, message: string) =>
  res.status(400).json({
    success: false,
    error: message,
  });

const normaliseTeam = (team: any) => {
  if (!team) {
    return null;
  }

  const { _id, id, ...rest } = team;
  const teamId = normaliseId(_id ?? id);

  return {
    ...rest,
    _id: teamId,
    id: teamId,
  };
};

const normaliseMatch = (match: any) => {
  const { _id, id, stadium, homeTeam, awayTeam, ...rest } = match;
  const matchId = normaliseId(_id ?? id);
  const stadiumId = normaliseId(stadium);

  return {
    ...rest,
    _id: matchId,
    id: matchId,
    stadium: stadiumId,
    homeTeam: normaliseTeam(homeTeam),
    awayTeam: normaliseTeam(awayTeam),
  };
};

const normaliseStadium = (stadium: any) => {
  const { _id, id, homeTeams, ...rest } = stadium;
  const stadiumId = normaliseId(_id ?? id);

  return {
    ...rest,
    _id: stadiumId,
    id: stadiumId,
    homeTeams: Array.isArray(homeTeams)
      ? homeTeams
          .map(teamId => normaliseId(teamId))
          .filter(Boolean)
      : homeTeams,
  };
};

const getUpcomingMatchesByStadium = async (
  stadiumIds: string[],
  limitPerStadium = 3
): Promise<Record<string, any[]>> => {
  if (!stadiumIds.length) {
    return {};
  }

  const now = new Date();
  const matches = await Match.find({
    stadium: { $in: stadiumIds },
    dateTime: { $gte: now },
  })
    .select('matchNumber stage group dateTime status score stadium homeTeam awayTeam')
    .populate('homeTeam', 'name shortCode flagUrl group colors')
    .populate('awayTeam', 'name shortCode flagUrl group colors')
    .sort({ dateTime: 1 })
    .lean();

  const grouped: Record<string, any[]> = {};

  for (const match of matches) {
    const stadiumId = normaliseId(match.stadium);
    if (!stadiumId) {
      continue;
    }

    if (!grouped[stadiumId]) {
      grouped[stadiumId] = [];
    }

    grouped[stadiumId].push(normaliseMatch(match));
  }

  Object.keys(grouped).forEach(key => {
    grouped[key] = grouped[key].slice(0, limitPerStadium);
  });

  return grouped;
};

const getRecentMatchesForStadium = async (stadiumId: string, limit = 3) => {
  const now = new Date();
  const matches = await Match.find({
    stadium: stadiumId,
    dateTime: { $lt: now },
  })
    .select('matchNumber stage group dateTime status score stadium homeTeam awayTeam')
    .populate('homeTeam', 'name shortCode flagUrl group colors')
    .populate('awayTeam', 'name shortCode flagUrl group colors')
    .sort({ dateTime: -1 })
    .limit(limit)
    .lean();

  return matches.map(normaliseMatch);
};

const prepareStadiumCollection = async (stadiums: any[], limitPerStadium = 3) => {
  if (!stadiums.length) {
    return [];
  }

  const stadiumIds = stadiums
    .map(stadium => normaliseId(stadium._id ?? stadium.id))
    .filter(Boolean) as string[];

  const upcomingMatches = await getUpcomingMatchesByStadium(
    stadiumIds,
    limitPerStadium
  );

  return stadiums.map(stadium => {
    const normalised = normaliseStadium(stadium);
    return {
      ...normalised,
      upcomingMatches: upcomingMatches[normalised.id] ?? [],
    };
  });
};

// GET /api/stadiums - Get all stadiums with optional city filter
router.get('/', async (req: Request, res, next) => {
  try {
    const resolvedCity = resolveCity(req.query.city);

    if (req.query.city && !resolvedCity) {
      return handleValidationError(
        res,
        'Invalid city. Must be one of: Rabat, Casablanca, Marrakesh, Agadir, Fez, Tangier'
      );
    }

    const filter: Record<string, any> = {};

    if (resolvedCity) {
      filter.city = {
        $regex: new RegExp(`^${escapeRegExp(resolvedCity)}$`, 'i'),
      };
    }

    const stadiums = await Stadium.find(filter)
      .sort({ city: 1, name: 1 })
      .lean();

    const data = await prepareStadiumCollection(stadiums);

    res.set('Cache-Control', 'public, max-age=300');
    res.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stadiums/city/:city - Get stadiums by city (case-insensitive)
router.get('/city/:city', async (req: Request, res, next) => {
  try {
    const resolvedCity = resolveCity(req.params.city);

    if (!resolvedCity) {
      return handleValidationError(
        res,
        'Invalid city. Must be one of: Rabat, Casablanca, Marrakesh, Agadir, Fez, Tangier'
      );
    }

    const stadiums = await Stadium.find({
      city: {
        $regex: new RegExp(`^${escapeRegExp(resolvedCity)}$`, 'i'),
      },
    })
      .sort({ name: 1 })
      .lean();

    const data = await prepareStadiumCollection(stadiums);

    res.set('Cache-Control', 'public, max-age=300');
    res.json({
      success: true,
      data,
      count: data.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stadiums/nearby?lat=X&lng=Y&radius=50 - Find stadiums within a radius (km)
router.get('/nearby', async (req: Request, res, next) => {
  try {
    const { lat, lng, radius } = req.query;

    if (lat === undefined || lng === undefined) {
      return handleValidationError(
        res,
        'Latitude and longitude query parameters are required'
      );
    }

    const latitude = Array.isArray(lat) ? parseFloat(lat[0]) : parseFloat(lat as string);
    const longitude = Array.isArray(lng)
      ? parseFloat(lng[0])
      : parseFloat(lng as string);

    if (Number.isNaN(latitude) || Number.isNaN(longitude)) {
      return handleValidationError(res, 'Invalid latitude or longitude');
    }

    const radiusValue = radius
      ? Array.isArray(radius)
        ? parseFloat(radius[0])
        : parseFloat(radius as string)
      : 50;

    if (Number.isNaN(radiusValue) || radiusValue <= 0) {
      return handleValidationError(res, 'Radius must be a positive number');
    }

    const maxDistance = radiusValue * 1000; // Convert km to meters

    const stadiums = await Stadium.aggregate([
      {
        $geoNear: {
          near: {
            type: 'Point',
            coordinates: [longitude, latitude],
          },
          key: 'location',
          spherical: true,
          distanceField: 'distance',
          maxDistance,
        },
      },
      {
        $sort: { distance: 1 },
      },
    ]);

    const data = await prepareStadiumCollection(stadiums);

    const withDistance = data.map(stadium => {
      const distanceMeters =
        typeof stadium.distance === 'number' ? stadium.distance : undefined;

      return {
        ...stadium,
        distance: distanceMeters,
        distanceInKm:
          typeof distanceMeters === 'number'
            ? Number((distanceMeters / 1000).toFixed(2))
            : undefined,
      };
    });

    res.set('Cache-Control', 'public, max-age=120');
    res.json({
      success: true,
      data: withDistance,
      count: withDistance.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stadiums/:id - Get stadium by ID with match details
router.get('/:id', async (req: Request, res, next) => {
  try {
    const { id } = req.params;

    if (!mongoose.isValidObjectId(id)) {
      return res.status(404).json({
        success: false,
        error: 'Stadium not found',
      });
    }

    const stadium = await Stadium.findById(id).lean();

    if (!stadium) {
      return res.status(404).json({
        success: false,
        error: 'Stadium not found',
      });
    }

    const [upcoming, recent] = await Promise.all([
      getUpcomingMatchesByStadium([id], 5),
      getRecentMatchesForStadium(id, 3),
    ]);

    const normalised = normaliseStadium(stadium);

    res.set('Cache-Control', 'public, max-age=300');
    res.json({
      success: true,
      data: {
        ...normalised,
        upcomingMatches: upcoming[id] ?? [],
        recentMatches: recent,
      },
    });
  } catch (error) {
    next(error);
  }
});

export default router;
