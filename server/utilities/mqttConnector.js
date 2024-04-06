const mqtt = require('mqtt');

const messageEventHandler = (topic, message) => {
    const data = JSON.parse(message.toString());
    switch(topic){
        case 'backend/users/create':
            console.log('User creation detected', data);
    }
};

const connectToMQTT = async () => {
    try{
        const client = mqtt.connect(`mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_SERVER_PORT}`, {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD
        });
        client.subscribeAsync('sensors/ultrasonic');
        console.log('[SmartTrash Cloud Service]: Successfully connected to MQTT Server.');
        client.on('message', messageEventHandler);
    }catch(error){
        console.log('[SmartTrash Cloud Service]: Error trying connect to MQTT Server ->', error);
    }
};

module.exports = connectToMQTT;