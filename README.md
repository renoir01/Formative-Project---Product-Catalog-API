# Product Catalog API

A RESTful API for managing product catalogs with support for categories, variants, and inventory tracking.

## Features

1. Complete CRUD operations for products and categories
2. Product variant support (size, color, SKU)
3. Advanced search and filtering
4. Inventory tracking
5. Category management
6. Rate limiting and security features

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

4. Start the server

```bash
npm start
```

## API Endpoints

### Products

1. `GET /api/products` - List all products
2. `POST /api/products` - Create a new product
3. `GET /api/products/:id` - Get a specific product
4. `PUT /api/products/:id` - Update a product
5. `DELETE /api/products/:id` - Delete a product
6. `GET /api/products/stats` - Get product statistics
7. `GET /api/products/low-stock` - Get low stock products

### Categories

1. `GET /api/categories` - List all categories
2. `POST /api/categories` - Create a new category
3. `GET /api/categories/:id` - Get a specific category
4. `PUT /api/categories/:id` - Update a category
5. `DELETE /api/categories/:id` - Delete a category

## Example Usage

### Create a Product

```bash
curl -X POST http://localhost:3001/api/products \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Classic T-Shirt",
    "description": "Comfortable cotton t-shirt",
    "basePrice": 19.99,
    "category": "category_id_here",
    "tags": ["clothing", "t-shirt", "casual"],
    "variants": [
      {
        "size": "M",
        "color": "Blue",
        "sku": "TS-BL-M",
        "price": 19.99,
        "stock": 100
      }
    ]
  }'
```

### Search Products

```bash
# Search by text
curl "http://localhost:3001/api/products?search=cotton"

# Filter by price range and color
curl "http://localhost:3001/api/products?minPrice=15&maxPrice=20&color=Blue"

# Get low stock items
curl "http://localhost:3001/api/products/low-stock?threshold=10"
```

## Error Handling

The API uses standard HTTP status codes and returns error messages in the following format:

```json
{
  "error": "Error message here",
  "status": "fail",
  "statusCode": 400
}
```

## Security Features

1. CORS enabled
2. Rate limiting
3. Helmet.js security headers
4. Input validation
5. MongoDB injection protection

## Development

Run in development mode:

```bash
npm run dev
```

Run tests:

```bash
npm test
```

## License

MIT
