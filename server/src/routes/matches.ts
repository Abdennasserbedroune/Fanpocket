import { Router, Request, Response } from 'express';
import { Match } from '../models/Match';

const router = Router();

router.get('/', async (req: Request, res: Response) => {
  try {
    const { stage, group, status } = req.query;
    const filter: any = {};

    if (stage && typeof stage === 'string') {
      filter.stage = stage;
    }

    if (group && typeof group === 'string') {
      filter.group = group.toUpperCase();
    }

    if (status && typeof status === 'string') {
      filter.status = status;
    }

    const matches = await Match.find(filter)
      .populate('homeTeam', 'name nameAr nameFr slug shortCode flag logo')
      .populate('awayTeam', 'name nameAr nameFr slug shortCode flag logo')
      .populate('stadium', 'name nameAr nameFr slug city location capacity')
      .select(
        'matchNumber homeTeam awayTeam stadium competition stage group dateTime status score ticketInfo'
      )
      .sort({ dateTime: 1 });

    res.json({
      success: true,
      count: matches.length,
      data: matches,
    });
  } catch (error) {
    console.error('Error fetching matches:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching matches',
    });
  }
});

router.get('/:id', async (req: Request, res: Response) => {
  try {
    const match = await Match.findById(req.params.id)
      .populate('homeTeam')
      .populate('awayTeam')
      .populate('stadium');

    if (!match) {
      return res.status(404).json({
        success: false,
        message: 'Match not found',
      });
    }

    res.json({
      success: true,
      data: match,
    });
  } catch (error) {
    console.error('Error fetching match:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching match',
    });
  }
});

export default router;
