const mqtt = require('mqtt');

class mqttController{
    constructor(){
        this.client = null;
    }

    async checkTopicActivity(topicName, timeout = 3000){
        return new Promise(async (resolve, reject) => {
            if(!this.client || !this.client.connected){
                reject(new Error('MQTT::ClientNotConnected'));
                return;
            }
            let messageReceived = false;
            await this.client.subscribeAsync(topicName);
            const messageHandler = () => {
                messageReceived = true;
            };
            this.client.on('message', messageHandler);
            setTimeout(async () => {
                await this.client.unsubscribeAsync(topicName);
                this.client.off('message', messageHandler);
                resolve(messageReceived);
            }, timeout);
        });
    };

    async connect(){
        try{
            this.client = await mqtt.connectAsync(`mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_SERVER_PORT}`, {
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD
            });
            console.log('[SmartTrash Cloud Server]: Successfully connected to MQTT Server.');
        }catch(error){
            console.log('[SmartTrash Cloud Server]: Error trying connect to MQTT Server ->', error);
        }
    }
};

const mqttClient = new mqttController();

module.exports = mqttClient;