import express from 'express';
import { User } from '../models/User';
import { Team } from '../models/Team';
import { authenticateToken } from '../middleware/auth';
import mongoose from 'mongoose';

const router = express.Router();

// All routes require authentication
router.use(authenticateToken);

// POST /api/favorites/:teamId - Add team to favorites
router.post('/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user._id;

    // Validate team ID
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: 'Invalid team ID' });
    }

    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Check if team already in favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    if (user.favoriteTeams.includes(teamId)) {
      return res.status(400).json({ message: 'Team already in favorites' });
    }

    // Add team to favorites
    if (user) {
      user.favoriteTeams.push(teamId);
      await user.save();
    }

    // Return updated user object
    const updatedUser = await User.findById(userId).populate('favoriteTeams');
    res.json(updatedUser);
  } catch (error) {
    console.error('Add favorite error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// DELETE /api/favorites/:teamId - Remove team from favorites
router.delete('/:teamId', async (req, res) => {
  try {
    const { teamId } = req.params;
    const userId = req.user._id;

    // Validate team ID
    if (!mongoose.Types.ObjectId.isValid(teamId)) {
      return res.status(400).json({ message: 'Invalid team ID' });
    }

    // Check if team exists
    const team = await Team.findById(teamId);
    if (!team) {
      return res.status(404).json({ message: 'Team not found' });
    }

    // Remove team from favorites
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const favoriteIndex = user.favoriteTeams.indexOf(teamId);
    
    if (favoriteIndex === -1) {
      return res.status(404).json({ message: 'Team not in favorites' });
    }

    user.favoriteTeams.splice(favoriteIndex, 1);
    await user.save();

    // Return updated user object
    const updatedUser = await User.findById(userId).populate('favoriteTeams');
    res.json(updatedUser);
  } catch (error) {
    console.error('Remove favorite error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// GET /api/favorites - Get current user's favorite teams
router.get('/', async (req, res) => {
  try {
    const userId = req.user._id;

    // Get user with populated favorite teams
    const user = await User.findById(userId).populate({
      path: 'favoriteTeams',
      select: 'name nameAr nameFr shortCode flagUrl group city cityAr cityFr colors stats slug'
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Return just the favorite teams array
    res.json(user.favoriteTeams || []);
  } catch (error) {
    console.error('Get favorites error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;