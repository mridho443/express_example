const jwt = require('jsonwebtoken');
const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const { users } = require('../../db/schema');
const { eq } = require('drizzle-orm');
const db = require('../config/database');

const auth = () => async (req, res, next) => {
    try {
        const token = req.headers.authorization?.split(' ')[1];
        if (!token) {
            throw new ApiError(httpStatus.status.UNAUTHORIZED, 'Please authenticate');
        }

        const payload = jwt.verify(token, process.env.JWT_SECRET);
        const [user] = await db.select().from(users).where(eq(users.id, payload.sub));

        if (!user) {
            throw new ApiError(httpStatus.status.UNAUTHORIZED, 'User not found');
        }

        req.user = user;
        next();
    } catch (error) {
        next(new ApiError(httpStatus.status.UNAUTHORIZED, 'Please authenticate'));
    }
};

module.exports = auth;
