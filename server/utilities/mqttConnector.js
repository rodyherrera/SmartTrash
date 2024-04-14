const mqtt = require('mqtt');
const Device = require('@models/device');
const Queue = require('@utilities/queue');

/**
 * This class manages the connection to an MQTT server, receives messages from
 * devices, and updates device logs in the database.
*/
class mqttController{
    /**
     * The constructor initializes the MQTT client and an update queue.
    */
    constructor(){
        this.client = null;
        this.updateQueue = new Queue();
    }

    /**
     * Handles incoming messages from the MQTT server. Expects the message to be
     * JSON with a 'measuredDistance' property, then updates a device record with 
     * the distance information.
     *
     * @param {string} topicName - The topic name where the message originated.
     * @param {Buffer} message - The message in binary format.
     * @throws {Error} - If there's an error parsing the JSON message.
    */
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

    /**
     * Processes an update for a device. The update is appended (pushed) to the
     * 'logs' property of the corresponding device.
     *
     * @param {Object} update - Object containing properties:
     *   * {string} stduid  - Unique identifier of the device.
     *   * {Object} log - Log object to be appended to the device's logs.
     * @throws {Error} - If there's an error updating the device in the database.
    */
    async processUpdate(update){
        const { stduid, log } = update;
        try{
            await Device.updateOne({ stduid }, { $push: { logs: log } });
        }catch(error){
            console.error(`[Quantum Cloud Server]: Error processing update: ${error}`);
        }
    };

    /**
     * Checks for recent activity on an MQTT topic. Subscribes to the topic
     * and waits for a message.
     * 
     * @param {string} topicName - The name of the MQTT topic to subscribe to.
     * @param {number} [timeout=3000] - Milliseconds to wait before assuming no activity.
     * @returns {Promise<boolean>} - Resolves to `true` if a message arrives within
     *                              the timeout, otherwise resolves to `false`.
     * @throws {Error} - If the MQTT client is not connected (Error code 'MQTT::ClientNotConnected').
    */
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

    /**
     * Update processing loop. Waits for updates and processes them asynchronously.
    */
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

    /**
     * Connects to the MQTT server, subscribes to message topics, and starts 
     * update processing. Registers events to handle incoming messages.
     * @throws {Error} - If an error occurs while connecting to the MQTT server.
    */
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