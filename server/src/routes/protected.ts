import { Router, Response } from 'express';
import { authenticate, authorize } from '../middleware/auth';
import { AuthenticatedRequest } from '../middleware/auth';

const router = Router();

// GET /api/protected - Example protected route
router.get('/', authenticate, (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'You have access to this protected route',
    user: req.user,
  });
});

// GET /api/protected/admin - Example admin-only route
router.get('/admin', authenticate, authorize('admin'), (req: AuthenticatedRequest, res: Response) => {
  res.json({
    success: true,
    message: 'You have admin access',
    user: req.user,
  });
});

export default router;