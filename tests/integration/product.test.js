const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
const { users, categories } = require('../../src/db/schema');
const db = require('../../src/shared/config/database');
const jwt = require('jsonwebtoken');

setupTestDB();

describe('Product Routes', () => {
    let accessToken;
    let categoryId;

    beforeEach(async () => {
        const [user] = await db.insert(users).values({
            name: 'Test User',
            email: 'test@example.com',
            password: 'hashedPassword',
        }).returning();
        accessToken = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);

        const [category] = await db.insert(categories).values({ name: 'Electronics' }).returning();
        categoryId = category.id;
    });

    describe('POST /v1/products', () => {
        test('should return 201 and create product', async () => {
            const newProduct = {
                name: 'iPhone 15',
                price: 999,
                categoryId: categoryId
            };
            const res = await request(app)
                .post('/v1/products')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(newProduct)
                .expect(httpStatus.CREATED);

            expect(res.body.name).toBe(newProduct.name);
            expect(res.body.price).toBe(newProduct.price);
            expect(res.body.categoryId).toBe(categoryId);
        });

        test('should return 400 if categoryId is invalid', async () => {
            const newProduct = {
                name: 'iPhone 15',
                price: 999,
                categoryId: 99999
            };
            await request(app)
                .post('/v1/products')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(newProduct)
                .expect(httpStatus.NOT_FOUND);
        });
    });
});
