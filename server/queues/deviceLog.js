const Bull = require('bull');
const Device = require('@models/device');
const DeviceLogPartition = require('@models/deviceLogPartition');

/**
 * Creates a Bull queue named 'deviceLog'. The queue configuration
 * uses environment variables for Redis connection details (host, port, password).
 *
 * The expected format of `process.env` is:
 *
 * ```
 * process.env = {
 *   REDIS_HOST: 'your_redis_host',
 *   REDIS_PORT: 1234,  // Replace with your Redis port
 *   REDIS_PASSWORD: 'your_redis_password' // Optional password
 * };
 * ```
 *
 * @typedef {Bull.Queue} DeviceLogQueue
 * @property {async function(JobData): Promise<void>} process - Processes messages (jobs) in the queue.
 *
 * @module deviceLogQueueProcessor
*/
const deviceLogQueue = new Bull('deviceLog', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
});

/**
 * Generates a name for the device log partition based on the creation date.
 *
 * @param {Date} creationDate - The date the device log was created.
 * @returns {string} - The formatted date string representing the partition name (YYYY-MM-DD).
 *
 * @module deviceLogQueueProcessor
*/
const getLogPartitionName = (creationDate) => {
    const formattedDate = new Date(creationDate).toISOString().slice(0, 10);
    return formattedDate;
};

/**
 * A worker function that processes messages (jobs) from the `deviceLogQueue`.
 *
 * @param {Job} job - The message (job) containing the device log data.
 * @param {function(Error?): void} done - A callback function to signal job completion.
 *
 * @module deviceLogQueueProcessor
*/
deviceLogQueue.process(async function(job, done){
    try{
        const { data } = job;
        const { stduid, _id, createdAt } = data;
        await Device.updateOne({ stduid }, { $push: { logs: _id } });
        const partitionName = getLogPartitionName(createdAt);
        await DeviceLogPartition.updateOne({
            name: partitionName
        }, {
            $setOnInsert: { name: partitionName },
            $push: { logs: _id }
        }, { upsert: true });
    }catch(error){
        console.log('[SmartTrash Cloud]: Error processing the job (deviceLogQueue) ->', error);
    }finally{
        done();
    }
});

/**
 * Exports the `deviceLogQueue` instance, making it available to other parts of the application.
 *
 * @module deviceLogQueueProcessor
*/
module.exports = deviceLogQueue;