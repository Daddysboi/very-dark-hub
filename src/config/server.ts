import http from 'http';
import express from "express";
import logger from "../utils/logger";
import mongoose from "mongoose";

function onError(error: { syscall: string; code: string }) {
    if (error.syscall !== 'listen') throw error;

    switch (error.code) {
        case 'EACCES':
            logger.error('Port requires elevated privileges');
            return process.exit(1);
        case 'EADDRINUSE':
            logger.error('Port is already in use');
            return process.exit(1);
        default:
            throw error;
    }
}

function handleShutdown(server: any, signal: string) {
    logger.info(`Received ${signal}, shutting down server...`);

    const forceExitTimeout = setTimeout(() => {
        logger.error('Forcing server shutdown after timeout');
        process.exit(1);
    }, 30000);

    server.close(async () => {
        logger.info('Server closed.');
        try {
            await mongoose.disconnect();
            logger.info('Database connection closed.');
            clearTimeout(forceExitTimeout);
            process.exit(0);
        } catch (err) {
            logger.error('Error during database disconnection:', err);
            clearTimeout(forceExitTimeout);
            process.exit(1);
        }
    });
}

const serverConfig = (app: express.Express): void => {
    const server = http.createServer(app);
    function onListening() {
        const addr = server.address();
        const bind = typeof addr === 'string' ? `pipe ${addr}` : `port ${addr?.port}`;
        logger.info('-------------*----------------------------------');
        logger.info('|                                               |');
        logger.info('|          Started E Commerce Server            |');
        logger.info(`|       Server is listening on ${bind}        |`);
        logger.info('|                                               |');
        logger.info('-----------*------------------------------------');
    }

    server.listen(app.get('port'));
    server.on('error', onError);
    server.on('listening', onListening);
    process.on('SIGTERM', (signal) => handleShutdown(server, signal));
    process.on('SIGINT', (signal) => handleShutdown(server, signal));
}

export default serverConfig;