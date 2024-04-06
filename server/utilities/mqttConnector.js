const mqtt = require('mqtt');

let client;

const messageEventHandler = async (topic, message) => {
    const data = JSON.parse(message.toString());
    switch(topic){
        case 'backend/users/create':
            console.log('Creating user...');
            const { struid } = data;
            await client.publishAsync(struid, 'OK!')
    }
};

const connectToMQTT = async () => {
    try{
        client = await mqtt.connectAsync(`mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_SERVER_PORT}`, {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD
        });
        await client.subscribeAsync('sensors/ultrasonic');
        await client.subscribeAsync('backend/users/create');
        console.log('[SmartTrash Cloud Service]: Successfully connected to MQTT Server.');
        client.on('message', messageEventHandler);
    }catch(error){
        console.log('[SmartTrash Cloud Service]: Error trying connect to MQTT Server ->', error);
    }
};

module.exports = connectToMQTT;