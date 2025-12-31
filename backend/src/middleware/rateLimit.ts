import rateLimit from 'express-rate-limit';

// General limiter: 100 requests per 15 minutes
export const generalLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many requests, please try again later.' }
});

// Auth limiter: 5 requests per hour (for login/signup)
export const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000,
    max: 10, // Slightly higher than 5 to avoid accidental lockouts during dev
    standardHeaders: true,
    legacyHeaders: false,
    message: { error: 'Too many login attempts, please try again in an hour.' }
});
