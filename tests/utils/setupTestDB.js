const db = require('../../src/shared/config/database');
const { users, categories, products } = require('../../src/db/schema');
const { sql } = require('drizzle-orm');

const setupTestDB = () => {
    beforeAll(async () => {
        // any global setup
    });

    beforeEach(async () => {
        // Clean DB before each test
        await db.execute(sql`TRUNCATE TABLE ${users}, ${categories}, ${products} RESTART IDENTITY CASCADE`);
    });

    afterAll(async () => {
        // Close db connection if needed, though with pool it might be fine, but forceExit handles it
    });
};

module.exports = setupTestDB;
