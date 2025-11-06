import { Router } from 'express';
import { Match } from '../models/Match';
import { Team } from '../models/Team';
import { Stadium } from '../models/Stadium';

const router = Router();

// GET /api/matches - Get all matches
router.get('/', async (req, res, next) => {
  try {
    const { stage, group, date } = req.query;

    let filter: any = {};

    if (stage) {
      filter.stage = stage;
    }

    if (group) {
      filter.group = (group as string).toUpperCase();
    }

    if (date) {
      const startDate = new Date(date as string);
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + 1);
      filter.dateTime = {
        $gte: startDate,
        $lt: endDate,
      };
    }

    const matches = await Match.find(filter)
      .populate('homeTeam', 'name shortCode flagUrl')
      .populate('awayTeam', 'name shortCode flagUrl')
      .populate('stadium', 'name city capacity')
      .sort({ dateTime: 1 });

    res.json({
      success: true,
      data: matches,
      count: matches.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/:id - Get match by ID
router.get('/:id', async (req, res, next) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('homeTeam', 'name shortCode flagUrl')
      .populate('awayTeam', 'name shortCode flagUrl')
      .populate('stadium', 'name city capacity location');

    if (!match) {
      return res.status(404).json({
        success: false,
        error: 'Match not found',
      });
    }

    res.json({
      success: true,
      data: match,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/stage/:stage - Get matches by stage
router.get('/stage/:stage', async (req, res, next) => {
  try {
    const matches = await Match.find({ stage: req.params.stage })
      .populate('homeTeam', 'name shortCode flagUrl')
      .populate('awayTeam', 'name shortCode flagUrl')
      .populate('stadium', 'name city capacity')
      .sort({ dateTime: 1 });

    res.json({
      success: true,
      data: matches,
      count: matches.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/matches/group/:group - Get matches by group
router.get('/group/:group', async (req, res, next) => {
  try {
    const matches = await Match.find({
      group: req.params.group.toUpperCase(),
      stage: 'group',
    })
      .populate('homeTeam', 'name shortCode flagUrl')
      .populate('awayTeam', 'name shortCode flagUrl')
      .populate('stadium', 'name city capacity')
      .sort({ dateTime: 1 });

    res.json({
      success: true,
      data: matches,
      count: matches.length,
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
      .populate('homeTeam', 'name shortCode flagUrl')
      .populate('awayTeam', 'name shortCode flagUrl')
      .populate('stadium', 'name city capacity')
      .sort({ dateTime: 1 });

    res.json({
      success: true,
      data: matches,
      count: matches.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
