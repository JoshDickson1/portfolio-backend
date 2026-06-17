"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.env = void 0;
const zod_1 = require("zod");
const schema = zod_1.z.object({
    NODE_ENV: zod_1.z.enum(['development', 'production', 'test']).default('development'),
    PORT: zod_1.z.coerce.number().default(4000),
    SUPABASE_URL: zod_1.z.string().url(),
    SUPABASE_SERVICE_ROLE_KEY: zod_1.z.string().min(1),
    SUPABASE_JWT_SECRET: zod_1.z.string().min(1),
    IMAGEKIT_PUBLIC_KEY: zod_1.z.string().min(1),
    IMAGEKIT_PRIVATE_KEY: zod_1.z.string().min(1),
    IMAGEKIT_URL_ENDPOINT: zod_1.z.string().url(),
    JWT_SECRET: zod_1.z.string().min(32),
    JWT_EXPIRES_IN: zod_1.z.string().default('7d'),
    CORS_ORIGIN: zod_1.z.string().default('http://localhost:5173,https://www.joshuadickson.pro,https://joshuadickson.pro'),
    RATE_LIMIT_WINDOW_MS: zod_1.z.coerce.number().default(900_000),
    RATE_LIMIT_MAX: zod_1.z.coerce.number().default(300),
    SMTP_HOST: zod_1.z.string().default(''),
    SMTP_PORT: zod_1.z.coerce.number().default(587),
    SMTP_USER: zod_1.z.string().default(''),
    SMTP_PASS: zod_1.z.string().default(''),
    NOTIFY_EMAIL: zod_1.z.string().default(''),
    GITHUB_PAT: zod_1.z.string().default(''),
});
const parsed = schema.safeParse(process.env);
if (!parsed.success) {
    console.error('Invalid environment variables:', parsed.error.flatten().fieldErrors);
    process.exit(1);
}
exports.env = parsed.data;
//# sourceMappingURL=env.js.map