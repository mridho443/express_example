const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { users } = require('../../db/schema');
const { eq } = require('drizzle-orm');
const db = require('../config/database');
const config = require('../config');

const auth = () => async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            throw new ApiError(httpStatus.status.UNAUTHORIZED, 'Please authenticate');
        }

        const token = authHeader.split(' ')[1];
        const payload = jwt.verify(token, config.jwt.secret);
        const [user] = await db.select().from(users).where(eq(users.id, payload.sub));

        if (!user) {
            throw new ApiError(httpStatus.status.UNAUTHORIZED, 'User not found');
        }

        const userWithoutPassword = { ...user };
        delete userWithoutPassword.password;
        req.user = userWithoutPassword;
        next();
    } catch (error) {
        if (error instanceof ApiError) {
            next(error);
        } else {
            next(new ApiError(httpStatus.status.UNAUTHORIZED, 'Please authenticate'));
        }
    }
};

module.exports = auth;
