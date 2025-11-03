import { Router, Request, Response } from 'express';
import { Team } from '../models/Team';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { group } = req.query;
    const filter: any = {};

    if (group && typeof group === 'string') {
      filter.group = group.toUpperCase();
    }

    const teams = await Team.find(filter)
      .select(
        'name nameAr nameFr slug shortCode flag logo group city colors stats'
      )
      .sort({ group: 1, name: 1 });

    res.json({
      success: true,
      count: teams.length,
      data: teams,
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching teams',
    });
  }
});

router.get('/:slug', async (req: Request, res: Response) => {
  try {
    const team = await Team.findOne({ slug: req.params.slug }).populate(
      'stadium',
      'name nameAr nameFr slug city location capacity'
    );

    if (!team) {
      return res.status(404).json({
        success: false,
        message: 'Team not found',
      });
    }

    res.json({
      success: true,
      data: team,
    });
  } catch (error) {
    console.error('Error fetching team:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching team',
    });
  }
});

export default router;
