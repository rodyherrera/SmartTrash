const DeviceLog = require('@models/deviceLog');
const deviceLogPartitionQueue = require('@queues/deviceLogPartition');
const { redisClient } = require('@utilities/redisClient');

const enqueue = async (data) => {
    await redisClient.lPush('queue/device-log', JSON.stringify(data));
};

const processQueue = async () => {
    const items = await redisClient.lRange('queue/device-log', 0, -1);
    await redisClient.lTrim('queue/device-log', items.length, -1);
    const batch = items.map((item) => ({ insertOne: { document: JSON.parse(item) } }));
    await DeviceLog.bulkWrite(batch);
    // TODO: Verify if is really inserted 
    // const ids = Object.values(result.insertedIds);
    for(const { insertOne } of batch){
        const { document } = insertOne;
        const { _id, stduid } = document;
        deviceLogPartitionQueue.enqueue({ _id, stduid }).then(() => {});
    }
};

module.exports = { enqueue, processQueue };