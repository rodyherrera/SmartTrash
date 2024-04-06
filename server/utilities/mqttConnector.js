const mqtt = require('mqtt');

const connectToMQTT = async () => {
    try{
        client = await mqtt.connectAsync(`mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_SERVER_PORT}`, {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD
        });
        await client.subscribeAsync('sensors/ultrasonic');
        console.log('[SmartTrash Cloud Service]: Successfully connected to MQTT Server.');
        client.on('message', messageEventHandler);
    }catch(error){
        console.log('[SmartTrash Cloud Service]: Error trying connect to MQTT Server ->', error);
    }
};

module.exports = connectToMQTT;