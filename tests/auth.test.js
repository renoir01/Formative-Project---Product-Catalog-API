const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../src/app');
const User = require('../src/models/user.model');

describe('Authentication API', () => {
    beforeAll(async () => {
        await mongoose.connect(process.env.MONGODB_URI_TEST);
    });

    afterAll(async () => {
        await mongoose.connection.dropDatabase();
        await mongoose.connection.close();
    });

    beforeEach(async () => {
        await User.deleteMany({});
    });

    describe('POST /api/auth/register', () => {
        const validUser = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        it('should register a new user', async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(validUser)
                .expect(201);

            expect(response.body.success).toBe(true);
            expect(response.body.data.user).toHaveProperty('id');
            expect(response.body.data.user.email).toBe(validUser.email);
            expect(response.body.data).toHaveProperty('token');
        });

        it('should not register user with existing email', async () => {
            await User.create(validUser);

            const response = await request(app)
                .post('/api/auth/register')
                .send(validUser)
                .expect(400);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Email already registered');
        });
    });

    describe('POST /api/auth/login', () => {
        const user = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        beforeEach(async () => {
            await request(app)
                .post('/api/auth/register')
                .send(user);
        });

        it('should login with valid credentials', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: user.email,
                    password: user.password
                })
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data).toHaveProperty('token');
            expect(response.body.data.user.email).toBe(user.email);
        });

        it('should not login with invalid password', async () => {
            const response = await request(app)
                .post('/api/auth/login')
                .send({
                    email: user.email,
                    password: 'wrongpassword'
                })
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Invalid credentials');
        });
    });

    describe('GET /api/auth/profile', () => {
        let token;
        const user = {
            name: 'Test User',
            email: 'test@example.com',
            password: 'password123'
        };

        beforeEach(async () => {
            const response = await request(app)
                .post('/api/auth/register')
                .send(user);
            token = response.body.data.token;
        });

        it('should get user profile with valid token', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .set('Authorization', `Bearer ${token}`)
                .expect(200);

            expect(response.body.success).toBe(true);
            expect(response.body.data.email).toBe(user.email);
            expect(response.body.data.name).toBe(user.name);
        });

        it('should not get profile without token', async () => {
            const response = await request(app)
                .get('/api/auth/profile')
                .expect(401);

            expect(response.body.success).toBe(false);
            expect(response.body.message).toContain('Authentication token required');
        });
    });
});
