const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');

describe('Validation Middleware', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    describe('Product Validation', () => {
        it('should reject product creation with missing required fields', async () => {
            const response = await request(app)
                .post('/api/products')
                .send({})
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'name',
                    message: expect.stringContaining('required')
                })
            );
        });

        it('should reject product with invalid price', async () => {
            const response = await request(app)
                .post('/api/products')
                .send({
                    name: 'Test Product',
                    description: 'Test Description',
                    basePrice: -10,
                    category: '507f1f77bcf86cd799439011'
                })
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: 'basePrice',
                    message: expect.stringContaining('must be greater than')
                })
            );
        });
    });

    describe('Query Parameter Validation', () => {
        it('should reject invalid pagination parameters', async () => {
            const response = await request(app)
                .get('/api/products?page=invalid&limit=abc')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: expect.stringMatching(/page|limit/),
                    message: expect.stringContaining('must be a number')
                })
            );
        });

        it('should reject invalid price filter values', async () => {
            const response = await request(app)
                .get('/api/products?minPrice=abc&maxPrice=-10')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.errors).toContainEqual(
                expect.objectContaining({
                    field: expect.stringMatching(/minPrice|maxPrice/),
                    message: expect.stringContaining('must be')
                })
            );
        });
    });

    describe('ObjectId Validation', () => {
        it('should reject invalid MongoDB ObjectId', async () => {
            const response = await request(app)
                .get('/api/products/invalid-id')
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid ID format');
        });
    });
});
