const rateLimit = require('express-rate-limit');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const hpp = require('hpp');

// Rate limiting configuration
exports.limiter = rateLimit({
    max: 100, // Limit each IP to 100 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many requests from this IP, please try again in 15 minutes'
});

// More strict rate limiting for auth routes
exports.authLimiter = rateLimit({
    max: 5, // Limit each IP to 5 requests per windowMs
    windowMs: 15 * 60 * 1000, // 15 minutes
    message: 'Too many login attempts from this IP, please try again in 15 minutes'
});

// Security middleware configuration
exports.securityMiddleware = [
    // Set security HTTP headers
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                baseUri: ["'self'"],
                fontSrc: ["'self'", "https:", "data:"],
                scriptSrc: ["'self'", "'unsafe-inline'", "'unsafe-eval'"],
                styleSrc: ["'self'", "https:", "'unsafe-inline'"],
                imgSrc: ["'self'", "data:", "https:"],
                connectSrc: ["'self'"]
            }
        },
        crossOriginEmbedderPolicy: false,
        crossOriginResourcePolicy: { policy: "cross-origin" }
    }),

    // Data sanitization against NoSQL query injection
    mongoSanitize({
        replaceWith: '_'
    }),

    // Data sanitization against XSS
    xss(),

    // Prevent parameter pollution
    hpp({
        whitelist: [
            'price',
            'basePrice',
            'discountPercentage',
            'stock',
            'rating'
        ]
    })
];
