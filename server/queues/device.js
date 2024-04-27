const DeviceLog = require('@models/deviceLog');
const Bull = require('bull');

const deviceQueue = new Bull('deviceQueue', {
    redis: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT,
        password: process.env.REDIS_PASSWORD
    }
});

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

module.exports = deviceQueue;