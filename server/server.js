require('./aliases');

const { httpServer } = require('@config/express'); 
const { startDevicesListening } = require('@utilities/bootstrap');
const { redisConnector, redisClient } = require('@utilities/redisClient');
const mqttClient = require('@utilities/mqttClient');
const mongoConnector = require('@utilities/mongoConnector');

require('@config/ws');

// Server configuration
const SERVER_PORT = process.env.SERVER_PORT || 8000;
const SERVER_HOST = process.env.SERVER_HOSTNAME || '0.0.0.0';

/**
 * Handles uncaught exceptions, cleans the environment, and restarts the server. 
 * @param {Error} err - The uncaught exception.
*/
process.on('uncaughtException', async (error) => {
    console.error('[SmartTrash Cloud]: Uncaught Exception:', error);
});

/**
 * Handles unhandledRejection and print in console.
 * @param {String} reason - The unhandled rejection.
*/
process.on('unhandledRejection', (reason) => {
    console.error('[SmartTrash Cloud]: Unhandled Promise Rejection, reason:', reason);
});

/**
 * Handles SIGINT (Ctrl-C) for graceful shutdown.
*/
process.on('SIGINT', async () => {
    console.log('[SmartTrash Cloud]: SIGINT signal received, shutting down...');
    await redisClient.flushAll();
    process.exit(0);
});

// Starts the HTTP Server
httpServer.listen(SERVER_PORT, SERVER_HOST, async () => {
    try{
        await mongoConnector();
        await redisConnector();
        await mqttClient.connect();
        startDevicesListening();
        console.log(`[SmartTrash Cloud]: Server running at http://${SERVER_HOST}:${SERVER_PORT}/.`);
    }catch(error){
        console.error('[SmartTrash Cloud]: Error during server initialization:', error);
        process.exit(1);
    }
});