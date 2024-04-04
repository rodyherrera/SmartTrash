const mqtt = require('mqtt');

const messageEventHandler = (topic, message) => {
    if(topic !== process.env.MQTT_ULTRASONIC_SENSOR_TOPIC) return;
    const data = JSON.parse(message.toString());
    console.log(data);
};

const connectToMQTT = async () => {
    try{
        const client = mqtt.connect(`mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_SERVER_PORT}`, {
            username: process.env.MQTT_USERNAME,
            password: process.env.MQTT_PASSWORD
        });
        client.subscribeAsync(process.env.MQTT_ULTRASONIC_SENSOR_TOPIC);
        console.log('[SmartTrash Cloud Service]: Successfully connected to MQTT Server.');
        client.on('message', messageEventHandler);
    }catch(error){
        console.log('[SmartTrash Cloud Service]: Error trying connect to MQTT Server ->', error);
    }
};

module.exports = connectToMQTT;