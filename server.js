const app = require('./src/app');
const config = require('./src/shared/config/logger'); // actually we might need env config here, but relying on .env for now
const logger = require('./src/shared/config/logger');
require('dotenv').config();

const EXIT_FAILURE = 1;

let server;

const startServer = async () => {
    try {
        const port = process.env.PORT || 3000;
        server = app.listen(port, () => {
            logger.info(`Listening to port ${port}`);
        });
    } catch (error) {
        logger.error(error);
        process.exit(EXIT_FAILURE);
    }
};

startServer();

const exitHandler = () => {
    if (server) {
        server.close(() => {
            logger.info('Server closed');
            process.exit(1);
        });
    } else {
        process.exit(1);
    }
};

const unexpectedErrorHandler = (error) => {
    logger.error(error);
    exitHandler();
};

process.on('uncaughtException', unexpectedErrorHandler);
process.on('unhandledRejection', unexpectedErrorHandler);

process.on('SIGTERM', () => {
    logger.info('SIGTERM received');
    if (server) {
        server.close();
    }
});
