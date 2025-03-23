require('dotenv').config();

process.env.MONGODB_URI_TEST = 'mongodb://localhost:27017/product-catalog-test';
process.env.JWT_SECRET = 'test-secret-key';
process.env.JWT_EXPIRES_IN = '1h';
process.env.RATE_LIMIT_WINDOW_MS = '900000';
process.env.RATE_LIMIT_MAX_REQUESTS = '100';
process.env.MAX_FILE_SIZE = '5242880';
process.env.ALLOWED_FILE_TYPES = 'image/jpeg,image/png,image/webp';
