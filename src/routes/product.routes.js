const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');
const { validateProduct, validateInventoryUpdate } = require('../middleware/validation.middleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Variant:
 *       type: object
 *       properties:
 *         size:
 *           type: string
 *           example: Standard
 *         color:
 *           type: string
 *           example: Black
 *         sku:
 *           type: string
 *           example: GM-BLK-PRO
 *         price:
 *           type: number
 *           example: 69.99
 *         stock:
 *           type: integer
 *           example: 100
 *         discountPercentage:
 *           type: number
 *           example: 10
 *     Product:
 *       type: object
 *       required:
 *         - name
 *         - description
 *         - basePrice
 *         - category
 *       properties:
 *         name:
 *           type: string
 *           example: Pro Gaming Mouse
 *         description:
 *           type: string
 *           example: Professional high-performance gaming mouse with RGB lighting
 *         basePrice:
 *           type: number
 *           example: 69.99
 *         category:
 *           type: string
 *           example: 67dfbf4ab18eb37ad9105134
 *         tags:
 *           type: array
 *           items:
 *             type: string
 *           example: ['gaming', 'accessories', 'mouse']
 *         variants:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/Variant'
 */

/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: Get all products
 *     description: Retrieve a list of products with optional filtering and pagination
 *     parameters:
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search term for product name, description, or tags
 *       - in: query
 *         name: minPrice
 *         schema:
 *           type: number
 *         description: Minimum price filter
 *       - in: query
 *         name: maxPrice
 *         schema:
 *           type: number
 *         description: Maximum price filter
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Category ID to filter by
 *       - in: query
 *         name: sortBy
 *         schema:
 *           type: string
 *           enum: [name, price, createdAt]
 *         description: Field to sort by
 *       - in: query
 *         name: sortOrder
 *         schema:
 *           type: string
 *           enum: [asc, desc]
 *         description: Sort direction
 *     responses:
 *       200:
 *         description: A list of products
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/', productController.getAllProducts);

/**
 * @swagger
 * /api/products:
 *   post:
 *     summary: Create a new product
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       201:
 *         description: Product created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 */
router.post('/', validateProduct, productController.createProduct);

/**
 * @swagger
 * /api/products/stats:
 *   get:
 *     summary: Get product statistics
 *     description: Retrieve statistics about products including total count, average price, and category distribution
 *     responses:
 *       200:
 *         description: Product statistics
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalProducts:
 *                   type: integer
 *                 averagePrice:
 *                   type: number
 *                 categoryDistribution:
 *                   type: object
 */
router.get('/stats', productController.getProductStats);

/**
 * @swagger
 * /api/products/low-stock:
 *   get:
 *     summary: Get low stock products
 *     parameters:
 *       - in: query
 *         name: threshold
 *         schema:
 *           type: integer
 *           default: 10
 *         description: Stock level threshold
 *     responses:
 *       200:
 *         description: List of products with low stock
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Product'
 */
router.get('/low-stock', productController.getLowStockProducts);

/**
 * @swagger
 * /api/products/inventory:
 *   post:
 *     summary: Update product inventory
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *                 example: 67dfbf4ab18eb37ad9105134
 *               variantId:
 *                 type: string
 *                 example: 67dfbf4ab18eb37ad9105135
 *               stock:
 *                 type: integer
 *                 example: 100
 *     responses:
 *       200:
 *         description: Inventory updated successfully
 */
router.post('/inventory', validateInventoryUpdate, productController.updateInventory);

/**
 * @swagger
 * /api/products/{id}:
 *   get:
 *     summary: Get a product by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       200:
 *         description: Product details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Product'
 *   put:
 *     summary: Update a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Product'
 *     responses:
 *       200:
 *         description: Product updated successfully
 *   delete:
 *     summary: Delete a product
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: Product ID
 *     responses:
 *       204:
 *         description: Product deleted successfully
 */
router.get('/:id', productController.getProductById);
router.put('/:id', validateProduct, productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
