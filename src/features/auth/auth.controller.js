const httpStatus = require('http-status');
const authService = require('./auth.service');
const catchAsync = require('../../shared/utils/catchAsync');

const register = catchAsync(async (req, res) => {
    const user = await authService.register(req.body);
    const tokens = authService.generateTokens(user.id);
    res.status(httpStatus.status.CREATED).send({ user, tokens });
});

const login = catchAsync(async (req, res) => {
    const { email, password } = req.body;
    const user = await authService.loginUserWithEmailAndPassword(email, password);
    const tokens = authService.generateTokens(user.id);
    res.send({ user, tokens });
});

module.exports = {
    register,
    login,
};
