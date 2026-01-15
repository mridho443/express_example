const express = require('express');
const helmet = require('helmet');
const cors = require('cors');
const compression = require('compression');
const httpStatus = require('http-status');
const errorHandler = require('./shared/middlewares/errorHandler');
const routes = require('./routes'); // We will create this next
const ApiError = require('./shared/utils/ApiError'); // We need this util

const app = express();

// security HTTP headers
app.use(helmet());

// parse json request body
app.use(express.json());

// parse urlencoded request body
app.use(express.urlencoded({ extended: true }));

// gzip compression
app.use(compression());

// enable cors
app.use(cors());

// v1 api routes
app.use('/v1', routes);

// send back a 404 error for any unknown api request
app.use((req, res, next) => {
    next(new ApiError(httpStatus.status.NOT_FOUND, 'Not found'));
});

// handle error
app.use(errorHandler);

module.exports = app;
