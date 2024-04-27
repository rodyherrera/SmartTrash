const Bull = require('bull');
const Device = require('@models/device');
const DeviceLogPartition = require('@models/deviceLogPartition');

const deviceLogQueue = new Bull('deviceLog', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
});

const getLogPartitionName = (creationDate) => {
    const formattedDate = new Date(creationDate).toISOString().slice(0, 10);
    return formattedDate;
};

const processQueue = async () => {
    const jobs = await deviceLogQueue.getJobs();
    for(const job of jobs){
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
        await job.moveToCompleted('completed', true, true);
    }
};

setInterval(processQueue, 5000);

module.exports = deviceLogQueue;