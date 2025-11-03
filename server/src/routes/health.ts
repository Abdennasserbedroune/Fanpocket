import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';

const router = Router();

router.get('/health', (req: Request, res: Response) => {
  const dbStatus =
    mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';

  res.json({
    success: true,
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: dbStatus,
    uptime: process.uptime(),
  });
});

export default router;
