import { Router, Request, Response, NextFunction } from 'express';
import { Match } from '../models/Match';
import { Team } from '../models/Team';
import { Stadium } from '../models/Stadium';

const router = Router();

// Validation helpers
const validateStage = (stage: string): boolean => {
  const validStages = ['group', 'r16', 'quarter', 'semi', 'final'];
  return validStages.includes(stage);
};

const validateGroup = (group: string): boolean => {
  return /^[A-F]$/.test(group.toUpperCase());
};

const validatePagination = (limit?: string, offset?: string): { limit: number; offset: number } => {
  const parsedLimit = limit ? parseInt(limit, 10) : 20;
  const parsedOffset = offset ? parseInt(offset, 10) : 0;
  
  return {
    limit: Math.max(1, Math.min(100, parsedLimit)),
    offset: Math.max(0, parsedOffset),
  };
};

const validateDateRange = (dateRange?: string): { startDate?: Date; endDate?: Date } => {
  if (!dateRange) return {};
  
  const [start, end] = dateRange.split(',');
  if (!start || !end) return {};
  
  const startDate = new Date(start);
  const endDate = new Date(end);
  
  if (isNaN(startDate.getTime()) || isNaN(endDate.getTime())) return {};
  if (startDate > endDate) return {};
  
  return { startDate, endDate };
};

// Computed field helpers
const addComputedFields = (match: any) => {
  const now = new Date();
  const matchTime = new Date(match.dateTime);
  const timeToKickoff = matchTime.toISOString();
  const hoursUntilMatch = (matchTime.getTime() - now.getTime()) / (1000 * 60 * 60);
  
  let matchStatus: 'scheduled' | 'live' | 'finished';
  if (match.status === 'live' || match.status === 'finished') {
    matchStatus = match.status;
  } else if (hoursUntilMatch > 0) {
    matchStatus = 'scheduled';
  } else {
    matchStatus = 'finished';
  }
  
  // Handle both mongoose documents and plain objects
  const matchData = match.toObject ? match.toObject() : match;
  
  return {
    ...matchData,
    timeToKickoff,
    hoursUntilMatch,
    matchStatus,
  };
};

// Error handling middleware
const handleValidationError = (message: string, res: Response) => {
  return res.status(400).json({
    success: false,
    error: message,
  });
};

// GET /api/matches - Get all matches with filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const { 
      stage, 
      group, 
      team, 
      stadium, 
      dateRange, 
      limit, 
      offset 
    } = req.query;

    let filter: any = {};

    // Validate and apply stage filter
    if (stage) {
      if (!validateStage(stage as string)) {
        return handleValidationError('Invalid stage. Must be one of: group, r16, quarter, semi, final', res);
      }
      // Map short form to full stage names
      const stageMap: { [key: string]: string } = {
        'r16': 'round_of_16',
        'quarter': 'quarter_final',
        'semi': 'semi_final',
        'final': 'final',
        'group': 'group'
      };
      filter.stage = stageMap[stage as string] || stage;
    }

    // Validate and apply group filter
    if (group) {
      if (!validateGroup(group as string)) {
        return handleValidationError('Invalid group. Must be one of: A, B, C, D, E, F', res);
      }
      filter.group = (group as string).toUpperCase();
    }

    // Validate and apply team filter
    if (team) {
      const teamExists = await Team.findById(team);
      if (!teamExists) {
        return handleValidationError('Invalid team ID', res);
      }
      filter.$or = [
        { homeTeam: team },
        { awayTeam: team }
      ];
    }

    // Validate and apply stadium filter
    if (stadium) {
      const stadiumExists = await Stadium.findById(stadium);
      if (!stadiumExists) {
        return handleValidationError('Invalid stadium ID', res);
      }
      filter.stadium = stadium;
    }

    // Validate and apply date range filter
    if (dateRange) {
      const { startDate, endDate } = validateDateRange(dateRange as string);
      if (!startDate || !endDate) {
        return handleValidationError('Invalid date range. Use format: start,end (ISO dates)', res);
      }
      filter.dateTime = {
        $gte: startDate,
        $lte: endDate,
      };
    }

    // Validate pagination
    const { limit: parsedLimit, offset: parsedOffset } = validatePagination(limit as string, offset as string);

    // Execute query with pagination
    const [matches, totalCount] = await Promise.all([
      Match.find(filter)
        .populate('homeTeam', 'name shortCode flagUrl group')
        .populate('awayTeam', 'name shortCode flagUrl group')
        .populate('stadium', 'name city capacity location')
        .sort({ dateTime: 1 })
        .limit(parsedLimit)
        .skip(parsedOffset)
        .lean(),
      Match.countDocuments(filter)
    ]);

    // Add computed fields to each match
    const matchesWithComputed = matches.map(match => addComputedFields(match));

    // Set cache headers for immutable tournament data
    res.set('Cache-Control', 'public, max-age=300'); // 5 minutes cache

    res.json({
      success: true,
      data: matchesWithComputed,
      pagination: {
        limit: parsedLimit,
        offset: parsedOffset,
        total: totalCount,
        hasMore: parsedOffset + parsedLimit < totalCount,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/today - Get matches for today
router.get('/today', async (req, res, next) => {
  try {
    const today = new Date();
    const startOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate()
    );
    const endOfDay = new Date(
      today.getFullYear(),
      today.getMonth(),
      today.getDate() + 1
    );

    const matches = await Match.find({
      dateTime: {
        $gte: startOfDay,
        $lt: endOfDay,
      },
    })
      .populate('homeTeam', 'name shortCode flagUrl group')
      .populate('awayTeam', 'name shortCode flagUrl group')
      .populate('stadium', 'name city capacity')
      .sort({ dateTime: 1 })
      .lean();

    const matchesWithComputed = matches.map(match => addComputedFields(match));

    res.set('Cache-Control', 'public, max-age=60'); // Shorter cache for today's matches

    res.json({
      success: true,
      data: matchesWithComputed,
      count: matchesWithComputed.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/:id - Get match by ID with full details
router.get('/:id', async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('homeTeam', 'name shortCode flagUrl group colors')
      .populate('awayTeam', 'name shortCode flagUrl group colors')
      .populate('stadium', 'name city capacity location facilities transport nearbyAttractions')
      .lean();

    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found',
      });
    }

    // Add computed fields
    const matchWithComputed = addComputedFields(match);

    // Set cache headers
    res.set('Cache-Control', 'public, max-age=300');

    res.json({
      success: true,
      data: matchWithComputed,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/stage/:stage - Get matches by stage
router.get('/stage/:stage', async (req, res, next) => {
  try {
    const { stage } = req.params;
    
    // Validate stage parameter
    const validStages = ['group', 'round_of_16', 'quarter_final', 'semi_final', 'third_place', 'final'];
    if (!validStages.includes(stage)) {
      return handleValidationError('Invalid stage. Must be one of: group, round_of_16, quarter_final, semi_final, third_place, final', res);
    }

    const matches = await Match.find({ stage })
      .populate('homeTeam', 'name shortCode flagUrl group')
      .populate('awayTeam', 'name shortCode flagUrl group')
      .populate('stadium', 'name city capacity location')
      .sort({ dateTime: 1 })
      .lean();

    const matchesWithComputed = matches.map(match => addComputedFields(match));

    res.set('Cache-Control', 'public, max-age=300');

    res.json({
      success: true,
      data: matchesWithComputed,
      count: matchesWithComputed.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/group/:group - Get matches by group
router.get('/group/:group', async (req, res, next) => {
  try {
    const { group } = req.params;
    
    // Validate group parameter
    if (!validateGroup(group)) {
      return handleValidationError('Invalid group. Must be one of: A, B, C, D, E, F', res);
    }

    const matches = await Match.find({
      group: group.toUpperCase(),
      stage: 'group',
    })
      .populate('homeTeam', 'name shortCode flagUrl group')
      .populate('awayTeam', 'name shortCode flagUrl group')
      .populate('stadium', 'name city capacity location')
      .sort({ dateTime: 1 })
      .lean();

    const matchesWithComputed = matches.map(match => addComputedFields(match));

    res.set('Cache-Control', 'public, max-age=300');

    res.json({
      success: true,
      data: matchesWithComputed,
      count: matchesWithComputed.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/team/:teamId - All matches for a team (both home and away)
router.get('/team/:teamId', async (req, res, next) => {
  try {
    const { teamId } = req.params;

    // Validate team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    const matches = await Match.find({
      $or: [
        { homeTeam: teamId },
        { awayTeam: teamId }
      ]
    })
      .populate('homeTeam', 'name shortCode flagUrl group')
      .populate('awayTeam', 'name shortCode flagUrl group')
      .populate('stadium', 'name city capacity location')
      .sort({ dateTime: -1 }) // Sort by date descending (most recent first)
      .lean();

    const matchesWithComputed = matches.map(match => addComputedFields(match));

    // Separate upcoming and past matches
    const now = new Date();
    const upcoming = matchesWithComputed.filter(match => new Date(match.dateTime) > now);
    const past = matchesWithComputed.filter(match => new Date(match.dateTime) <= now);

    res.set('Cache-Control', 'public, max-age=300');

    res.json({
      success: true,
      data: {
        all: matchesWithComputed,
        upcoming: upcoming.sort((a, b) => new Date(a.dateTime).getTime() - new Date(b.dateTime).getTime()),
        past: past.sort((a, b) => new Date(b.dateTime).getTime() - new Date(a.dateTime).getTime()),
      },
      count: {
        total: matchesWithComputed.length,
        upcoming: upcoming.length,
        past: past.length,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/stadium/:stadiumId - All matches at a stadium
router.get('/stadium/:stadiumId', async (req, res, next) => {
  try {
    const { stadiumId } = req.params;

    // Validate stadium exists
    const stadium = await Stadium.findById(stadiumId);
    if (!stadium) {
      return res.status(404).json({
        success: false,
        error: 'Stadium not found',
      });
    }

    const matches = await Match.find({ stadium: stadiumId })
      .populate('homeTeam', 'name shortCode flagUrl group')
      .populate('awayTeam', 'name shortCode flagUrl group')
      .populate('stadium', 'name city capacity location facilities transport nearbyAttractions')
      .sort({ dateTime: 1 }) // Sort by date ascending (chronological order)
      .lean();

    const matchesWithComputed = matches.map(match => addComputedFields(match));

    res.set('Cache-Control', 'public, max-age=300');

    res.json({
      success: true,
      data: matchesWithComputed,
      count: matchesWithComputed.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
