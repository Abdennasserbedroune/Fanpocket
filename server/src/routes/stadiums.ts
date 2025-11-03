import { Router, Request, Response } from 'express';
import { Stadium } from '../models/Stadium';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const stadiums = await Stadium.find()
      .populate('homeTeams', 'name nameAr nameFr slug logo')
      .select(
        'name nameAr nameFr slug shortName city cityAr cityFr location capacity images facilities'
      )
      .sort({ capacity: -1 });

    res.json({
      success: true,
      count: stadiums.length,
      data: stadiums,
    });
  } catch (error) {
    console.error('Error fetching stadiums:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stadiums',
    });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const stadium = await Stadium.findOne({ slug: req.params.slug }).populate(
      'homeTeams',
      'name nameAr nameFr slug logo'
    );

    if (!stadium) {
      return res.status(404).json({
        success: false,
        message: 'Stadium not found',
      });
    }

    res.json({
      success: true,
      data: stadium,
    });
  } catch (error) {
    console.error('Error fetching stadium:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching stadium',
    });
  }
});

export default router;
