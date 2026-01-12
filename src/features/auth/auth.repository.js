const db = require('../../shared/config/database');
const { users } = require('../../db/schema');
const { eq } = require('drizzle-orm');

const createUser = async (userBody) => {
    const [user] = await db.insert(users).values(userBody).returning();
    return user;
};

const getUserByEmail = async (email) => {
    const [user] = await db.select().from(users).where(eq(users.email, email));
    return user;
};

const getUserById = async (id) => {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user;
};

module.exports = {
    createUser,
    getUserByEmail,
    getUserById,
};
