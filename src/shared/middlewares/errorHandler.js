const httpStatus = require('http-status');
const logger = require('../config/logger');

const errorHandler = (err, req, res, next) => {
    let { statusCode, message } = err;

    if (!statusCode) {
        statusCode = httpStatus.status.INTERNAL_SERVER_ERROR;
        message = httpStatus.status['500_MESSAGE'];
    }

    res.locals.errorMessage = err.message;

    const response = {
        code: statusCode,
        message,
        ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
    };

    if (process.env.NODE_ENV === 'development') {
        logger.error(err);
    }

    res.status(statusCode).send(response);
};

module.exports = errorHandler;
