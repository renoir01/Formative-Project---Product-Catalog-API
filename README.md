# Product Catalog API

A comprehensive RESTful API for managing product catalogs with support for categories, variants, inventory tracking, and user authentication.

## Features

1. Complete CRUD operations for products and categories
2. Product variant support (size, color, SKU)
3. Advanced search and filtering with pagination
4. Inventory tracking
5. Category management
6. User authentication and authorization
7. Rate limiting and security features
8. File upload support for product images
9. Comprehensive API documentation with Swagger
10. Test coverage with Jest

## Prerequisites

- Node.js (v14 or higher)
- MongoDB (v4.4 or higher)
- npm or yarn

## Installation

1. Clone the repository

```bash
git clone https://github.com/yourusername/product-catalog-api.git
cd product-catalog-api
```

2. Install dependencies

```bash
npm install
```

3. Configure environment variables

```bash
cp .env.example .env
# Edit .env with your settings
```

4. Start MongoDB (if not running)

```bash
# Windows
net start MongoDB
# Linux/Mac
sudo systemctl start mongod
```

5. Start the server

```bash
# Development
npm run dev

# Production
npm start
```

## API Documentation

Access the Swagger documentation at: `http://localhost:3001/api-docs`

### Authentication

All protected endpoints require a JWT token in the Authorization header:

```bash
Authorization: Bearer <your-token-here>
```

### Response Format

All responses follow this standard format:

```json
{
    "success": true,
    "message": "Operation successful",
    "data": {}
}
```

Error responses:

```json
{
    "success": false,
    "message": "Error message here",
    "errors": []
}
```

Paginated responses:

```json
{
    "success": true,
    "data": [],
    "pagination": {
        "page": 1,
        "limit": 10,
        "total": 100,
        "pages": 10
    }
}
```

## API Endpoints

### Authentication

- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/profile` - Get user profile (protected)

### Products

- `GET /api/products` - List all products (paginated)
- `POST /api/products` - Create new product (protected)
- `GET /api/products/:id` - Get specific product
- `PUT /api/products/:id` - Update product (protected)
- `DELETE /api/products/:id` - Delete product (protected)
- `GET /api/products/stats` - Get product statistics (protected)
- `GET /api/products/low-stock` - Get low stock products (protected)

### Categories

- `GET /api/categories` - List all categories
- `POST /api/categories` - Create new category (protected)
- `GET /api/categories/:id` - Get specific category
- `PUT /api/categories/:id` - Update category (protected)
- `DELETE /api/categories/:id` - Delete category (protected)

## Query Parameters

### Products List

- `page`: Page number (default: 1)
- `limit`: Items per page (default: 10, max: 100)
- `search`: Search term for name/description
- `minPrice`: Minimum price filter
- `maxPrice`: Maximum price filter
- `category`: Filter by category ID
- `sort`: Sort order (price_asc, price_desc, name_asc, name_desc)

## Testing

Run tests:

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

## Error Handling

The API uses standard HTTP status codes:

- 200: Success
- 201: Created
- 400: Bad Request
- 401: Unauthorized
- 403: Forbidden
- 404: Not Found
- 500: Internal Server Error

## Security Features

1. JWT Authentication
2. Rate Limiting
3. Input Validation
4. CORS Protection
5. Secure Password Hashing
6. File Upload Validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
