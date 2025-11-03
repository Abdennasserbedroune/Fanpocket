import express, { Application } from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { config } from './config';
import { connectDatabase } from './config/database';
import { errorHandler, notFound } from './middleware/errorHandler';
import { generalLimiter } from './middleware/rateLimiter';
import healthRouter from './routes/health';

const app: Application = express();

const startServer = async () => {
  await connectDatabase();

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

  app.use(generalLimiter);

  app.use('/api', healthRouter);

  app.use(notFound);
  app.use(errorHandler);

  const PORT = config.port;

  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT} in ${config.nodeEnv} mode`);
  });
};

startServer().catch(error => {
  console.error('Failed to start server:', error);
  process.exit(1);
});

export default app;
