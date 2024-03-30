require('./aliases');

const { httpServer } = require('@config/express'); 
const mongoConnector = require('@utilities/mongoConnector');

// Server configuration
const SERVER_PORT = process.env.SERVER_PORT || 8000;
const SERVER_HOST = process.env.SERVER_HOSTNAME || '0.0.0.0';

/**
 * Handles uncaught exceptions, cleans the environment, and restarts the server. 
 * @param {Error} err - The uncaught exception.
*/
process.on('uncaughtException', async (error) => {
    console.error('[SmartTrash Cloud Server]: Uncaught Exception:', error);
});

/**
 * Handles unhandledRejection and print in console.
 * @param {String} reason - The unhandled rejection.
*/
process.on('unhandledRejection', (reason) => {
    console.error('[SmartTrash Cloud Server]: Unhandled Promise Rejection, reason:', reason);
});

/**
 * Handles SIGINT (Ctrl-C) for graceful shutdown.
*/
process.on('SIGINT', async () => {
    console.log('[SmartTrash Cloud Server]: SIGINT signal received, shutting down...');
    process.exit(0);
});

// Starts the HTTP Server
httpServer.listen(SERVER_PORT, SERVER_HOST, async () => {
    try{
        await mongoConnector();
        console.log(`[SmartTrash Cloud Server]: Server running at http://${SERVER_HOST}:${SERVER_PORT}/.`);
    }catch(error){
        console.error('[SmartTrash Cloud Server]: Error during server initialization:', error);
        process.exit(1);
    }
});