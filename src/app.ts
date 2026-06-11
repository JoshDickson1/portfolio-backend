import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import { env } from './config/env';
import { rateLimiter } from './config/rateLimit';
import { router } from './routes';
import { errorHandler } from './middleware/errorHandler.middleware';
import { notFound } from './middleware/notFound.middleware';

// Production origins are always allowed regardless of env var.
// This prevents Render's dashboard env value from accidentally blocking the live site.
const ALWAYS_ALLOWED_ORIGINS = [
  'https://www.joshuadickson.pro',
  'https://joshuadickson.pro',
  'http://localhost:5173',
  'http://localhost:3000',
];

function buildAllowedOrigins(): string[] {
  const envOrigins = (env.CORS_ORIGIN ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean);
  return [...new Set([...ALWAYS_ALLOWED_ORIGINS, ...envOrigins])];
}

export function createApp() {
  const app = express();

  const allowedOrigins = buildAllowedOrigins();

  // Security & parsing
  app.use(helmet());
  app.use(
    cors({
      origin: (origin, cb) => {
        // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
        if (!origin) return cb(null, true);
        if (allowedOrigins.includes(origin)) return cb(null, true);
        cb(new Error(`Origin ${origin} not allowed by CORS`));
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    })
  );
  // Ensure preflight OPTIONS is handled before any other middleware
  app.options('*', cors());
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));
  app.use(morgan(env.NODE_ENV === 'production' ? 'combined' : 'dev'));

  // Health check must be before rate limiter so Render's checks never get 429'd
  app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));

  app.use(rateLimiter);

  // API routes
  app.use('/api/v1', router);

  // Error handling (must be last)
  app.use(notFound);
  app.use(errorHandler);

  return app;
}
