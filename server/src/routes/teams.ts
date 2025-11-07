import { Router } from 'express';
import { Team } from '../models/Team';

const router = Router();

// Helper function to validate group parameter
const validateGroup = (group: string): boolean => {
  return /^[A-F]$/.test(group.toUpperCase());
};

// Helper function to format team response
const formatTeamResponse = (team: any) => {
  const stats = team.stats || {};
  return {
    id: team._id,
    name: team.name,
    shortCode: team.shortCode,
    flagUrl: team.flagUrl,
    group: team.group,
    stats: {
      wins: stats.won || 0,
      losses: stats.lost || 0,
      draws: stats.drawn || 0,
      goalsFor: stats.goalsFor || 0,
      goalsAgainst: stats.goalsAgainst || 0,
    },
    colors: team.colors || { primary: '', secondary: '' },
    city: team.city,
    squad: team.squad || [],
  };
};

// GET /api/teams - Get all teams with optional filtering and pagination
router.get('/', async (req, res, next) => {
  try {
    const { group, search, limit = '20', offset = '0' } = req.query;

    // Build query
    const query: any = {};

    // Filter by group if provided
    if (group) {
      if (!validateGroup(group as string)) {
        return res.status(400).json({
          success: false,
          error: 'Invalid group parameter. Must be one of: A, B, C, D, E, F',
        });
      }
      query.group = (group as string).toUpperCase();
    }

    // Search by name if provided
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { nameAr: { $regex: search, $options: 'i' } },
        { nameFr: { $regex: search, $options: 'i' } },
      ];
    }

    // Parse pagination parameters
    const limitNum = Math.min(Math.max(parseInt(limit as string) || 20, 1), 100);
    const offsetNum = Math.max(parseInt(offset as string) || 0, 0);

    // Execute query with pagination
    const teams = await Team.find(query)
      .sort({ group: 1, name: 1 })
      .limit(limitNum)
      .skip(offsetNum)
      .lean();

    // Get total count for pagination metadata
    const total = await Team.countDocuments(query);

    // Format response
    const formattedTeams = teams.map(formatTeamResponse);

    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours cache
    res.json({
      success: true,
      data: formattedTeams,
      pagination: {
        limit: limitNum,
        offset: offsetNum,
        total,
        hasMore: offsetNum + limitNum < total,
      },
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/teams/:id - Get team by ID
router.get('/:id', async (req, res, next) => {
  try {
    // Validate MongoDB ObjectId
    if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid team ID format',
      });
    }

    const team = await Team.findById(req.params.id).lean();
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }

    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours cache
    res.json({
      success: true,
      data: formatTeamResponse(team),
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/teams/group/:group - Get teams by group
router.get('/group/:group', async (req, res, next) => {
  try {
    const { group } = req.params;

    // Validate group parameter
    if (!validateGroup(group)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid group parameter. Must be one of: A, B, C, D, E, F',
      });
    }

    const teams = await Team.find({ group: group.toUpperCase() })
      .sort({ name: 1 })
      .lean();

    const formattedTeams = teams.map(formatTeamResponse);

    res.set('Cache-Control', 'public, max-age=86400'); // 24 hours cache
    res.json({
      success: true,
      data: formattedTeams,
      count: formattedTeams.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
