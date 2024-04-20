const mqtt = require('mqtt');
const Device = require('@models/device');
const DeviceLog = require('@models/deviceLog');
const { redisClient } = require('@utilities/redisClient');

/**
 * Manages communication with the MQTT server, handling messages,
 * and updating device data.
*/
class MQTTController{
    /**
     * Creates an MQTTController instance.
    */
    constructor(){
        /**
         * The active MQTT client connection.
         * @type {mqtt.MqttClient}
        */
        this.client = null;
        /**
         * A map of registered message handlers and their options.
         * @type {Map<string, {options: Object, callback: function}>} 
        */
        this.handlers = new Map();
    };

    /**
     * Establishes a connection to the MQTT server.
     * @returns {Promise<void>}
    */
    async connect(){
        try{
            this.client = await mqtt.connectAsync(`mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_SERVER_PORT}`, {
                username: process.env.MQTT_USERNAME,
                password: process.env.MQTT_PASSWORD
            });
            this.client.on('message', this.handleIncomingMessage.bind(this));
            console.log('[SmartTrash Cloud]: Successfully connected to MQTT Server.');
        }catch(error){
            console.error('[SmartTrash Cloud]: Error connecting to MQTT Server:', error);
        }
    };

    /**
     * Verifies activity on a specified MQTT topic.
     * @param {string} topicName - The name of the MQTT topic to monitor.
     * @param {number} [timeout=3000] - Timeout in milliseconds.
     * @returns {Promise<boolean>} - `true` if a message was received, `false` otherwise.
     * @throws {Error} - If the client is not connected (Error code: 'MQTT::ClientNotConnected').
    */  
    async checkTopicActivity(topicName, timeout = 3000){
        if(!this.client || !this.client.connected){
            throw new Error('MQTT::ClientNotConnected'); 
        }
        return new Promise((resolve, reject) => {
            let messageReceived = false;
            const messageHandler = () => {
                messageReceived = true;
                unsubscribeAndCleanup();
            };

            const unsubscribeAndCleanup = async () => {
                await this.client.unsubscribeAsync(topicName);
                this.client.off('message', messageHandler);
                resolve(messageReceived);
            };

            this.client.on('message', messageHandler);
            this.client.subscribeAsync(topicName).catch(reject);
            setTimeout(unsubscribeAndCleanup, timeout);
        });
    };

    /**
     * Handles an incoming MQTT message, updates the relevant device, and logs data.
     * @param {string} topicName - The MQTT topic name.
     * @param {number} distance - The measured distance reported by the device.
     * @returns {Promise<void>}
    */
    async handleIncomingMessage(topicName, distance){
        try{
            const stduid = topicName.toString();
            distance = distance.toString();
            let deviceData = await redisClient.get(`mqttc-device:${stduid}`);
            if(deviceData){
                await this.processMessage(stduid, JSON.parse(deviceData), distance);
            }else{
                const device = await Device.findOne({ stduid }).select('height stduid distance');
                if(device){
                    await redisClient.set(`mqttc-device:${stduid}`, JSON.stringify(device));
                    await this.processMessage(stduid, device, distance);
                }else{
                    console.error(`[SmartTrash Cloud]: Device not found for STDUID: ${stduid}`);
                }
            }
        }catch(error){
            console.error(`[SmartTrash Cloud]: Error parsing message: ${error}`);
        }
    };

    /**
     * Processes an MQTT message, calculating usage and updating data.
     * @param {string} stduid - The device's STDUID
     * @param {object} device - The device object 
     * @param {number} distance - The measured distance 
     */
    async processMessage(stduid, device, distance){
        if(!device || typeof device.height !== 'number' || device.height <= 0){
            // Device data is invalid
            return;
        }
        const clampedDistance = Math.max(0, Math.min(distance, device.height));
        const usagePercentage = Math.floor(100 - ((clampedDistance / device.height) * 100))
        
        // Notify handlers
        for(const { options, callback } of this.handlers.values()){
            if(options?.topicName && (options.topicName !== stduid)){
                continue;
            }
            callback({ measuredDistance: distance, usagePercentage });
        }
        await DeviceLog.create({
            height: device.height,
            distance,
            stduid
        });
    };

    /**
     * Adds a message handler for MQTT messages.
     * @param {string} id - A unique identifier for the handler.
     * @param {Object} options - Handler options (e.g., topicName).
     * @param {function} callback - Callback function to execute when a message is received.
    */
    addHandler(id, options, callback){
        this.handlers.set(id, { options, callback });
    };

    /**
     * Removes a message handler.
     * @param {string} id - The ID of the handler to remove.
    */
    deleteHandler(id){
        this.handlers.delete(id);
    }
};

module.exports = MQTTController;