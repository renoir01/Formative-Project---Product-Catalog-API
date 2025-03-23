const express = require('express');
const mongoose = require('mongoose');
const morgan = require('morgan');
const helmet = require('helmet');
const cors = require('cors');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('./config/swagger');
require('dotenv').config();

const productRoutes = require('./routes/product.routes');
const categoryRoutes = require('./routes/category.routes');
const collectionRoutes = require('./routes/collection.routes');
const errorHandler = require('./middleware/error.middleware');
const { AppError } = require('./middleware/error.middleware');
const rateLimit = require('express-rate-limit');

const app = express();
const PORT = process.env.PORT || 3001;

// Global error handler for uncaught exceptions
process.on('uncaughtException', err => {
  console.error('UNCAUGHT EXCEPTION! Shutting down...');
  console.error(err.name, err.message, err.stack);
  process.exit(1);
});

// Middleware
app.use(express.json({ limit: '10kb' }));
app.use(morgan('dev'));
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      ...helmet.contentSecurityPolicy.getDefaultDirectives(),
      "img-src": ["'self'", "data:", "https:"],
      "style-src": ["'self'", "https:", "'unsafe-inline'"],
      "font-src": ["'self'", "https:", "data:"],
      "script-src": ["'self'", "'unsafe-inline'", "'unsafe-eval'"] // Required for Swagger UI
    }
  }
}));
app.use(cors());

// Serve static files from public directory
app.use(express.static(path.join(__dirname, '../public')));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again after 15 minutes'
});
app.use('/api', limiter);

// API Documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "Product Catalog API Documentation",
  customfavIcon: "/favicon.ico"
}));

// Root route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, '../public/index.html'));
});

// API Information route
app.get('/api', (req, res) => {
  res.json({
    name: 'Product Catalog API',
    version: '1.0.0',
    description: 'RESTful API for managing product catalog with categories and variants',
    endpoints: {
      products: {
        base: '/api/products',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        features: ['Search', 'Filtering', 'Pagination', 'Statistics']
      },
      categories: {
        base: '/api/categories',
        methods: ['GET', 'POST', 'PUT', 'DELETE']
      },
      collections: {
        base: '/api/collections',
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        features: ['Active Collections', 'Product Management', 'Discounts']
      }
    },
    documentation: {
      swagger: '/api-docs',
      description: 'For detailed API documentation, please refer to the README.md file',
      repository: 'https://github.com/yourusername/product-catalog-api'
    }
  });
});

// Routes
app.use('/api/products', productRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/collections', collectionRoutes);

// Handle undefined routes
app.all('*', (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.statusCode || 500).json({
    status: 'error',
    message: err.message || 'Internal Server Error'
  });
});

// Global error handling middleware
app.use(errorHandler);

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/product-catalog', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => {
  console.log('Connected to MongoDB');
  const server = app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });

  // Handle unhandled rejections
  process.on('unhandledRejection', err => {
    console.error('UNHANDLED REJECTION! Shutting down...');
    console.error(err.name, err.message);
    server.close(() => {
      process.exit(1);
    });
  });
})
.catch((error) => {
  console.error('MongoDB connection error:', error);
  process.exit(1);
});

module.exports = app;
