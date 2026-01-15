const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const ApiError = require('../../shared/utils/ApiError');
const config = require('../../shared/config');

const sanitizeUser = (user) => {
    if (!user) {
        return null;
    }
    const sanitized = { ...user };
    delete sanitized.password;
    return sanitized;
};

const register = async (userBody) => {
    if (await authRepository.getUserByEmail(userBody.email)) {
        throw new ApiError(httpStatus.status.BAD_REQUEST, 'Email already taken');
    }
    const hashedPassword = await bcrypt.hash(userBody.password, 8);
    const user = await authRepository.createUser({ ...userBody, password: hashedPassword });
    return sanitizeUser(user);
};

const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await authRepository.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(httpStatus.status.UNAUTHORIZED, 'Incorrect email or password');
    }
    return sanitizeUser(user);
};

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ sub: userId }, config.jwt.secret, {
        expiresIn: config.jwt.accessExpirationMinutes + 'm',
    });
    return {
        access: {
            token: accessToken,
            expires: new Date(Date.now() + config.jwt.accessExpirationMinutes * 60 * 1000),
        },
    };
};

module.exports = {
    register,
    loginUserWithEmailAndPassword,
    generateTokens,
    sanitizeUser,
};
