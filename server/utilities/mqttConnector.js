const mqtt = require('mqtt');
const Device = require('@models/device');
const DeviceLog = require('@models/deviceLog');

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
        this.handlers = new Map();
    };

    addHandler(id, options, callback){
        this.handlers.set(id, { options, callback });
    };

    deleteHandler(id){
        this.handlers.delete(id);
    };

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
            const { data } = JSON.parse(message.toString());
            const { measuredDistance } = data;
            const stduid = topicName.toString();
            const device = await Device
                .findOne({ stduid })
                .select('height');
                
            const usagePercentage = Math.round((measuredDistance / device.height) * 100);
            device.usagePercentage = usagePercentage;
            for(const { options, callback } of this.handlers.values()){
                if(options?.topicName && (options.topicName !== topicName)){
                    continue;
                }
                callback({ measuredDistance, usagePercentage });
            }
            await DeviceLog.create({ 
                height: device.height, 
                distance: measuredDistance, 
                usagePercentage, 
                stduid 
            });
            await device.save();
        }catch(error){
            console.error(`[Quantum Cloud Server]: Error parsing message: ${error}`);
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
            console.log('[SmartTrash Cloud Server]: Successfully connected to MQTT Server.');
        }catch(error){
            console.log('[SmartTrash Cloud Server]: Error trying connect to MQTT Server ->', error);
        }
    }
};

const mqttClient = new mqttController();

module.exports = mqttClient;