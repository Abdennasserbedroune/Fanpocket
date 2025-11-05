import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from '../config';
import { errorHandler, notFound } from '../middleware/errorHandler';
import healthRouter from '../routes/health';
import authRouter from '../routes/auth-test';
import protectedRouter from '../routes/protected';

const createTestApp = (): express.Application => {
  const app = express();

  app.use(helmet());
  app.use(
    cors({
      origin: config.cors.origin,
      credentials: true,
    })
  );

  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true, limit: '10mb' }));
  app.use(cookieParser());

  // Disable rate limiting for tests
  // app.use(generalLimiter);

  app.use('/api', healthRouter);
  app.use('/api/auth', authRouter);
  app.use('/api/protected', protectedRouter);

  app.use(notFound);
  app.use(errorHandler);

  return app;
};

export default createTestApp;