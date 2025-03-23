const express = require('express');
const router = express.Router();
const collectionController = require('../controllers/collection.controller');

/**
 * @swagger
 * components:
 *   schemas:
 *     Collection:
 *       type: object
 *       required:
 *         - name
 *         - description
 *       properties:
 *         name:
 *           type: string
 *           example: Summer Sale
 *         description:
 *           type: string
 *           example: Summer collection with special discounts
 *         products:
 *           type: array
 *           items:
 *             type: string
 *           example: ['product_id_1', 'product_id_2']
 *         isActive:
 *           type: boolean
 *           example: true
 *         startDate:
 *           type: string
 *           format: date-time
 *         endDate:
 *           type: string
 *           format: date-time
 *         discountPercentage:
 *           type: number
 *           example: 20
 *         imageUrl:
 *           type: string
 *           example: https://example.com/collection-image.jpg
 */

/**
 * @swagger
 * /api/collections:
 *   get:
 *     summary: Get all collections
 *     responses:
 *       200:
 *         description: List of all collections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collection'
 */
router.get('/', collectionController.getAllCollections);

/**
 * @swagger
 * /api/collections/active:
 *   get:
 *     summary: Get active collections
 *     responses:
 *       200:
 *         description: List of active collections
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Collection'
 */
router.get('/active', collectionController.getActiveCollections);

/**
 * @swagger
 * /api/collections:
 *   post:
 *     summary: Create a new collection
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Collection'
 *     responses:
 *       201:
 *         description: Collection created successfully
 */
router.post('/', collectionController.createCollection);

/**
 * @swagger
 * /api/collections/{id}:
 *   get:
 *     summary: Get a collection by ID
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Collection details
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Collection'
 */
router.get('/:id', collectionController.getCollection);

/**
 * @swagger
 * /api/collections/{id}:
 *   put:
 *     summary: Update a collection
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Collection'
 *     responses:
 *       200:
 *         description: Collection updated successfully
 */
router.put('/:id', collectionController.updateCollection);

/**
 * @swagger
 * /api/collections/{id}:
 *   delete:
 *     summary: Delete a collection
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       204:
 *         description: Collection deleted successfully
 */
router.delete('/:id', collectionController.deleteCollection);

/**
 * @swagger
 * /api/collections/{id}/products:
 *   post:
 *     summary: Add a product to a collection
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               productId:
 *                 type: string
 *     responses:
 *       200:
 *         description: Product added to collection successfully
 */
router.post('/:id/products', collectionController.addProductToCollection);

/**
 * @swagger
 * /api/collections/{id}/products/{productId}:
 *   delete:
 *     summary: Remove a product from a collection
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *       - in: path
 *         name: productId
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Product removed from collection successfully
 */
router.delete('/:id/products/:productId', collectionController.removeProductFromCollection);

module.exports = router;
