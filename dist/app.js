"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = createApp;
const express_1 = __importDefault(require("express"));
const helmet_1 = __importDefault(require("helmet"));
const cors_1 = __importDefault(require("cors"));
const morgan_1 = __importDefault(require("morgan"));
const env_1 = require("./config/env");
const rateLimit_1 = require("./config/rateLimit");
const routes_1 = require("./routes");
const errorHandler_middleware_1 = require("./middleware/errorHandler.middleware");
const notFound_middleware_1 = require("./middleware/notFound.middleware");
// Production origins are always allowed regardless of env var.
// This prevents Render's dashboard env value from accidentally blocking the live site.
const ALWAYS_ALLOWED_ORIGINS = [
    'https://www.joshuadickson.pro',
    'https://joshuadickson.pro',
    'http://localhost:5173',
    'http://localhost:3000',
];
function buildAllowedOrigins() {
    const envOrigins = (env_1.env.CORS_ORIGIN ?? '')
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    return [...new Set([...ALWAYS_ALLOWED_ORIGINS, ...envOrigins])];
}
function createApp() {
    const app = (0, express_1.default)();
    const allowedOrigins = buildAllowedOrigins();
    // Security & parsing
    app.use((0, helmet_1.default)());
    app.use((0, cors_1.default)({
        origin: (origin, cb) => {
            // Allow requests with no origin (mobile apps, curl, Postman, server-to-server)
            if (!origin)
                return cb(null, true);
            if (allowedOrigins.includes(origin))
                return cb(null, true);
            cb(new Error(`Origin ${origin} not allowed by CORS`));
        },
        credentials: true,
        methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        optionsSuccessStatus: 200, // Some legacy browsers choke on 204
    }));
    // Ensure preflight OPTIONS is handled before any other middleware
    app.options('*', (0, cors_1.default)());
    app.use(express_1.default.json({ limit: '10mb' }));
    app.use(express_1.default.urlencoded({ extended: true }));
    app.use((0, morgan_1.default)(env_1.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
    // Health check must be before rate limiter so Render's checks never get 429'd
    app.get('/health', (_, res) => res.json({ status: 'ok', ts: new Date().toISOString() }));
    app.use(rateLimit_1.rateLimiter);
    // API routes
    app.use('/api/v1', routes_1.router);
    // Error handling (must be last)
    app.use(notFound_middleware_1.notFound);
    app.use(errorHandler_middleware_1.errorHandler);
    return app;
}
//# sourceMappingURL=app.js.map