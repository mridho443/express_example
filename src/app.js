const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const httpStatus = require('http-status');
const errorHandler = require('./shared/middlewares/errorHandler');
const { generalLimiter } = require('./shared/middlewares/rateLimiter');
const routes = require('./routes');
const ApiError = require('./shared/utils/ApiError');
const setupSwagger = require('./shared/config/swagger');

const app = express();

app.use(helmet());
app.use(generalLimiter);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(compression());
app.use(cors());

setupSwagger(app);

app.get('/health', (req, res) => {
    res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

app.use('/v1', routes);

app.use((req, res, next) => {
    next(new ApiError(httpStatus.status.NOT_FOUND, 'Not found'));
});

app.use(errorHandler);

module.exports = app;
