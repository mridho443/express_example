const httpStatus = require('http-status');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authRepository = require('./auth.repository');
const ApiError = require('../../shared/utils/ApiError');

const register = async (userBody) => {
    if (await authRepository.getUserByEmail(userBody.email)) {
        throw new ApiError(httpStatus.BAD_REQUEST, 'Email already taken');
    }
    const hashedPassword = await bcrypt.hash(userBody.password, 8);
    const user = await authRepository.createUser({ ...userBody, password: hashedPassword });
    return user;
};

const loginUserWithEmailAndPassword = async (email, password) => {
    const user = await authRepository.getUserByEmail(email);
    if (!user || !(await bcrypt.compare(password, user.password))) {
        throw new ApiError(httpStatus.UNAUTHORIZED, 'Incorrect email or password');
    }
    return user;
};

const generateTokens = (userId) => {
    const accessToken = jwt.sign({ sub: userId }, process.env.JWT_SECRET, {
        expiresIn: process.env.JWT_ACCESS_EXPIRATION_MINUTES + 'm',
    });
    return {
        access: {
            token: accessToken,
            expires: new Date(Date.now() + process.env.JWT_ACCESS_EXPIRATION_MINUTES * 60 * 1000),
        },
    };
};

module.exports = {
    register,
    loginUserWithEmailAndPassword,
    generateTokens,
};
