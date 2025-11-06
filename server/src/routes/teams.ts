import { Router } from 'express';
import { Team } from '../models/Team';

const router = Router();

// GET /api/teams - Get all teams
router.get('/', async (req, res, next) => {
  try {
    const teams = await Team.find().sort({ group: 1, name: 1 });
    res.json({
      success: true,
      data: teams,
      count: teams.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/teams/:id - Get team by ID
router.get('/:id', async (req, res, next) => {
  try {
    const team = await Team.findById(req.params.id);
    if (!team) {
      return res.status(404).json({
        success: false,
        error: 'Team not found',
      });
    }
    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/teams/group/:group - Get teams by group
router.get('/group/:group', async (req, res, next) => {
  try {
    const teams = await Team.find({
      group: req.params.group.toUpperCase(),
    }).sort({ name: 1 });
    res.json({
      success: true,
      data: teams,
      count: teams.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
