import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { rateLimiter } from './config/rateLimit';
import { router } from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFound } from './middleware/notFound.middleware';

export function createApp() {
  const app = express();

  // Security & parsing
  app.use(helmet());
  app.use(cors({ origin: env.CORS_ORIGIN.split(','), credentials: true }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));
  app.use(rateLimiter);

  // Health check
  app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

  // API routes
  app.use('/api/v1', router);

  // Error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
