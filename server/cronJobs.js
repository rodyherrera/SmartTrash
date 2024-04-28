require('./aliases');

const cron = require('node-cron');
const deviceLogPartitionQueue = require('@queues/deviceLogPartition');
const deviceLogQueue = require('@queues/deviceLog');

const mongoConnector = require('@utilities/mongoConnector');
const { redisConnector } = require('@utilities/redisClient');

(async () => {
    await mongoConnector();
    await redisConnector();

    cron.schedule('*/1 * * * * *', async () => {
        deviceLogPartitionQueue.processQueue().then(() => {});
        deviceLogQueue.processQueue().then(() => {});
    });
})();