const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const Product = require('../src/models/product.model');

describe('Product API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await Product.deleteMany({});
    });

    describe('GET /api/products', () => {
        it('should return paginated products', async () => {
            const response = await request(app)
                .get('/api/products')
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.pagination).toBeDefined();
            expect(Array.isArray(response.body.data)).toBe(true);
        });

        it('should filter products by price range', async () => {
            const response = await request(app)
                .get('/api/products?minPrice=10&maxPrice=50')
                .expect(200);

            response.body.data.forEach(product => {
                expect(product.basePrice).toBeGreaterThanOrEqual(10);
                expect(product.basePrice).toBeLessThanOrEqual(50);
            });
        });
    });
});
