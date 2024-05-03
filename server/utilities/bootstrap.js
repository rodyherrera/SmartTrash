const Device = require('@models/device');
const mqttClient = require('@utilities/mqttClient');
const { spawn } = require('child_process');
const { capitalizeToLowerCaseWithDelimitier } = require('@utilities/algorithms');

exports.startCronJobs = async () => {
    const cronJobProcess = spawn('node', ['cronJobs.js']);
    console.log('[SmartTrash Cloud]: Starting Cron Jobs...');
    cronJobProcess.on('spawn', () => {
        console.log('[SmartTrash Cloud]: Cron Jobs loaded successfully.');
    });

    cronJobProcess.stderr.on('data', (data) => {
        console.log(`[SmartTrash Cloud] CronJob: ${data}`);
    });
};

exports.startDevicesListening = async () => {
    try{
        console.log('[SmartTrash Cloud]: Loading linked devices...');
        const devices = await Device.find().select('stduid -_id').lean();
        console.log(`[SmartTrash Cloud]: Found ${devices.length} devices.`);
        await Promise.all(devices.map(async ({ stduid }) => {
            // stduid: SmartTrash Device's Unique ID.
            await mqttClient.client.subscribeAsync(stduid);
        }));
        console.log('[SmartTrash Cloud]: Subscriptions to all devices have been initialized.');
    }catch(error){
        console.log('[SmartTrash Cloud] CRITICAL ERROR (at @utilities/bootstrap - startDevicesListening):', error);
    }
};

/**
 * Configures the Express application with provided routes, middlewares, and settings.
 *
 * @param {Object} options - Configuration options
 * @param {Object} options.app - The Express application instance.
 * @param {Array} options.routes - Array of route names.
 * @param {string} options.suffix - Base route suffix for the configured routes.
 * @param {Array} options.middlewares - Array of middleware functions.
 * @param {Object} options.settings - Settings for enabling/disabling app features.
*/
exports.configureApp = ({ app, routes, suffix, middlewares, settings }) => {
    middlewares.forEach((middleware) => app.use(middleware));
    routes.forEach((route) => {
        const path = suffix + capitalizeToLowerCaseWithDelimitier(route);
        const router = require(`../routes/${route}`);
        app.use(path, router);
    });
    settings.deactivated.forEach((deactivated) => app.disabled(deactivated));
};

module.exports = exports;