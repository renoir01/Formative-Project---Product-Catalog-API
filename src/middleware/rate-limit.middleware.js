const rateLimit = require('express-rate-limit');
const { errorResponse } = require('../utils/response.utils');

const limiter = rateLimit({
    windowMs: parseInt(process.env.RATE_LIMIT_WINDOW_MS) || 15 * 60 * 1000, // 15 minutes by default
    max: parseInt(process.env.RATE_LIMIT_MAX_REQUESTS) || 100, // Limit each IP to 100 requests per windowMs
    message: errorResponse('Too many requests from this IP, please try again later'),
    standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
    legacyHeaders: false, // Disable the `X-RateLimit-*` headers
});

// More strict limiter for auth routes
const authLimiter = rateLimit({
    windowMs: 60 * 60 * 1000, // 1 hour
    max: 5, // Limit each IP to 5 login attempts per hour
    message: errorResponse('Too many login attempts, please try again later'),
    standardHeaders: true,
    legacyHeaders: false,
});

module.exports = {
    limiter,
    authLimiter
};
