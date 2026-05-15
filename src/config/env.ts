import { z } from 'zod';

const schema = z.object({
  NODE_ENV:               z.enum(['development', 'production', 'test']).default('development'),
  PORT:                   z.coerce.number().default(4000),
  SUPABASE_URL:           z.string().url(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().min(1),
  SUPABASE_JWT_SECRET:    z.string().min(1),
  IMAGEKIT_PUBLIC_KEY:    z.string().min(1),
  IMAGEKIT_PRIVATE_KEY:   z.string().min(1),
  IMAGEKIT_URL_ENDPOINT:  z.string().url(),
  JWT_SECRET:             z.string().min(32),
  JWT_EXPIRES_IN:         z.string().default('7d'),
  CORS_ORIGIN:            z.string().default('http://localhost:5173'),
  RATE_LIMIT_WINDOW_MS:   z.coerce.number().default(900_000),
  RATE_LIMIT_MAX:         z.coerce.number().default(100),
});

const parsed = schema.safeParse(process.env);

if (!parsed.success) {
  console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
  process.exit(1);
}

export const env = parsed.data;
