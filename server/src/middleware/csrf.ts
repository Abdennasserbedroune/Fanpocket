import { Request, Response, NextFunction } from 'express';
import { randomBytes } from 'crypto';

export const csrfProtection = (req: Request, res: Response, next: NextFunction) => {
  if (req.method === 'GET') {
    const csrfToken = randomBytes(32).toString('hex');
    res.cookie('csrf-token', csrfToken, {
      httpOnly: false,
      secure: process.env.COOKIE_SECURE === 'true',
      sameSite: 'lax',
      maxAge: 3600000, // 1 hour
    });
    return next();
  }

  if (['POST', 'PUT', 'DELETE', 'PATCH'].includes(req.method)) {
    const csrfToken = req.cookies['csrf-token'];
    const csrfHeader = req.headers['x-csrf-token'];

    if (!csrfToken || !csrfHeader || csrfToken !== csrfHeader) {
      return res.status(403).json({
        success: false,
        error: 'CSRF token mismatch',
      });
    }
  }

  next();
};