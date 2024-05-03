const DeviceLogPartition = require('@models/deviceLogPartition');
const { redisClient } = require('@utilities/redisClient');

const enqueue = async (data) => {
    await redisClient.lPush('queue/device-log-partition', JSON.stringify(data));
};

const getLogPartitionName = (creationDate) => {
    const formattedDate = new Date(creationDate).toISOString().slice(0, 10);
    return formattedDate;
};

const processQueue = async () => {
    const items = await redisClient.lRange('queue/device-log-partition', 0, -1); 
    await redisClient.lTrim('queue/device-log-partition', items.length, -1);
    const partitionUpdates = [];
    for(let item of items){
        item = JSON.parse(item);
        const { _id, stduid } = item;
        const partitionName = getLogPartitionName(new Date());
        partitionUpdates.push({
            updateOne: {
                filter: { name: partitionName, stduid },
                update: { $setOnInsert: { name: partitionName, stduid }, $push: { logs: _id } },
                upsert: true
            }
        });
    }
    await DeviceLogPartition.bulkWrite(partitionUpdates);
};

module.exports = { enqueue, processQueue };