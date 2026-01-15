const { drizzle } = require('drizzle-orm/node-postgres');
const { Pool } = require('pg');
const config = require('./index');

const pool = new Pool({
    connectionString: config.database.url,
    max: 20,
    idleTimeoutMillis: 30000,
    connectionTimeoutMillis: 2000,
});

const db = drizzle(pool);

module.exports = db;
