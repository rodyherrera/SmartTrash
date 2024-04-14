const mqtt = require('mqtt');
const Device = require('@models/device');
const Queue = require('@utilities/queue');


class mqttController{
    constructor(){
        this.client = null;
        this.updateQueue = new Queue();
    }

    async messageEventHandler(topicName, message){
        try{
            const { measuredDistance } = JSON.parse(message.toString());
            const stduid = topicName.toString();
            const log = { distance: measuredDistance };
            this.updateQueue.enqueue({ stduid, log });
        }catch(error){
            console.error(`[Quantum Cloud Server]: Error parsing message: ${error}`);
        }
    };

    async processUpdate(update){
        const { stduid, log } = update;
        try{
            await Device.updateOne({ stduid }, { $push: { logs: log } });
        }catch(error){
            console.error(`[Quantum Cloud Server]: Error processing update: ${error}`);
        }
    };

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

    async startAsyncUpdateProcessing(){
        while(true){
            const update = this.updateQueue.dequeue();
            if(update){
                await this.processUpdate(update);
            }else{
                await new Promise(resolve => setTimeout(resolve, 1000)); 
            }
        }
    };

    async connect(){
        try{
            this.client = await mqtt.connectAsync(`mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_SERVER_PORT}`, {
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD
            });
            this.client.on('message', this.messageEventHandler.bind(this));
            this.startAsyncUpdateProcessing();
            console.log('[SmartTrash Cloud Server]: Successfully connected to MQTT Server.');
        }catch(error){
            console.log('[SmartTrash Cloud Server]: Error trying connect to MQTT Server ->', error);
        }
    }
};

const mqttClient = new mqttController();

module.exports = mqttClient;