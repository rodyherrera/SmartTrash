const DeviceLog = require('@models/deviceLog');
const Bull = require('bull');

/**
 * Creates a Bull queue named 'deviceQueue'. The queue configuration
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
 * @typedef {Bull.Queue} DeviceQueue
 * @property {async function(JobData): Promise<void>} process - Processes messages (jobs) in the queue.
 *
 * @module deviceQueueProcessor
*/
const deviceQueue = new Bull('deviceQueue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
});

/**
 * A worker function that processes messages (jobs) from the `deviceQueue`.
 *
 * @param {Job} job - The message (job) containing the data for creating a device log.
 * @param {function(Error?): void} done - A callback function to signal job completion.
 *
 * @module deviceQueueProcessor
*/
deviceQueue.process(async function(job, done){
    try{
        const { data } = job;
        await DeviceLog.create(data);
    }catch(error){
        console.log('[SmartTrash Cloud]: Error trying processing the job (deviceQueue) ->', error);
    }finally{
        done();
    }
});

/**
 * Exports the `deviceQueue` instance, making it available to other parts of the application.
 *
 * @module deviceQueueProcessor
*/
module.exports = deviceQueue;