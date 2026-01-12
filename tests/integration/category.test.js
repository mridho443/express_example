const request = require('supertest');
const httpStatus = require('http-status');
const app = require('../../src/app');
const setupTestDB = require('../utils/setupTestDB');
// const { registerUser } = require('../utils/testHelpers');
const { users, categories } = require('../../src/db/schema');
const db = require('../../src/shared/config/database');
const jwt = require('jsonwebtoken');

setupTestDB();

const getUserAccessToken = async () => {
    const [user] = await db.insert(users).values({
        name: 'Test User',
        email: 'test@example.com',
        password: 'hashedPassword',
    }).returning();
    const token = jwt.sign({ sub: user.id }, process.env.JWT_SECRET);
    return token;
};

describe('Category Routes', () => {
    let accessToken;

    beforeEach(async () => {
        accessToken = await getUserAccessToken();
    });

    describe('POST /v1/categories', () => {
        test('should return 201 and create category', async () => {
            const newCategory = { name: 'Electronics' };
            const res = await request(app)
                .post('/v1/categories')
                .set('Authorization', `Bearer ${accessToken}`)
                .send(newCategory)
                .expect(httpStatus.CREATED);

            expect(res.body.name).toBe(newCategory.name);
        });

        test('should return 401 if not authorized', async () => {
            await request(app).post('/v1/categories').send({ name: 'Test' }).expect(httpStatus.UNAUTHORIZED);
        });
    });

    describe('GET /v1/categories', () => {
        test('should return 200 and all categories', async () => {
            await db.insert(categories).values({ name: 'Books' });
            const res = await request(app).get('/v1/categories').expect(httpStatus.OK);
            expect(res.body).toHaveLength(1);
            expect(res.body[0].name).toBe('Books');
        });
    });
});
