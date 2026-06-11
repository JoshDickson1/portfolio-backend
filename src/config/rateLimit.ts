import rateLimit from 'express-rate-limit';
import { env } from './env';

export const rateLimiter = rateLimit({
  windowMs: env.RATE_LIMIT_WINDOW_MS,
  max: env.RATE_LIMIT_MAX,
  standardHeaders: true,
  legacyHeaders: false,
  message: { success: false, message: 'Too many requests, please try again later.' },
  // Skip preflight requests — a rate-limited OPTIONS reply has no CORS headers,
  // which the browser misreports as a CORS error.
  skip: (req) => req.method === 'OPTIONS',
});

export const strictLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
});
