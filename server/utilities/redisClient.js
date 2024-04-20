const redis = require('redis');

const redisClient = redis.createClient({
    socket: {
        host: process.env.REDIS_HOST,
        port: process.env.REDIS_PORT
    },
    password: process.env.REDIS_PASSWORD
});

const redisConnector = async () => {
    try{
        console.log('[SmartTrash Cloud]: Connecting to Redis server...');
        await redisClient.connect();
        console.log('[SmartTrash Cloud]: Connected to Redis.');
    }catch(error){
        console.log('[SmartTrash Cloud]: Error trying connect to Redis ->', error);
    };
};

module.exports = { redisConnector, redisClient };