import { Router } from 'express';
import { Stadium } from '../models/Stadium';

const router = Router();

// GET /api/stadiums - Get all stadiums
router.get('/', async (req, res, next) => {
  try {
    const stadiums = await Stadium.find().sort({ city: 1, name: 1 });
    res.json({
      success: true,
      data: stadiums,
      count: stadiums.length,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stadiums/:id - Get stadium by ID
router.get('/:id', async (req, res, next) => {
  try {
    const stadium = await Stadium.findById(req.params.id);
    if (!stadium) {
      return res.status(404).json({
        success: false,
        error: 'Stadium not found',
      });
    }
    res.json({
      success: true,
      data: stadium,
    });
  } catch (error) {
    next(error);
  }
});

// GET /api/stadiums/city/:city - Get stadiums by city
router.get('/city/:city', async (req, res, next) => {
  try {
    const stadiums = await Stadium.find({
      city: { $regex: new RegExp(req.params.city, 'i') },
    }).sort({ name: 1 });
    res.json({
      success: true,
      data: stadiums,
      count: stadiums.length,
    });
  } catch (error) {
    next(error);
  }
});

export default router;
