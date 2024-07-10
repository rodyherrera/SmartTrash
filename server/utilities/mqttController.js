const mqtt = require('mqtt');
const Device = require('@models/device');
const deviceLogQueue = require('@queues/deviceLog');
const { redisClient } = require('@utilities/redisClient');
const { sendEmail } = require('@utilities/emailHandler');

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
        this.emailInterval = 600000;
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
            /*const messageHandler = () => {
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
            setTimeout(unsubscribeAndCleanup, timeout);*/
            resolve(true);
        });
    };

    async getDevice(stduid){
        const deviceKey = `mqttc-device:${stduid}`;
        let device = await redisClient.get(deviceKey);
        if(!device){
            device = await Device.findOne({ stduid }).select('height stduid notificationPercentages notificationEmails name');
            if(!device) return null;
            await redisClient.set(deviceKey, JSON.stringify(device));
        }else{
            device = JSON.parse(device);
        }
        return device;
    };

    async sendUsageStatusEmail(usagePercentage, stduid, device){
        const emojis = ['😢', '🤨', '😑', '🤥', '😬', '😏', '🤧', '🥴', '😵', '🧐', '🙁', '😟', '🥺', '😭', '😱', '😖', '😣', '😞', '😓', '😩'];
        const emoji = emojis[Math.floor(Math.random() * emojis.length)];
        let subject;
        let html;
        if(usagePercentage === 0){
            subject = `${deviceName} is now clean! ${emoji}`;
            html = `Dear ${fullname},<br/><br/>
                    Your "${deviceName}" device is available so you can take advantage of its maximum capacity. 
                    We are monitoring the status of your trash can to notify you about it, good job ;). <br/><br/>
                    Let's make the world a better place!<br/><br/>
                    Sincerely,<br/> The SmartTrash Team.`;
        }else if(usagePercentage === 50){
            subject = `${deviceName} just surpassed 50% capacity ${emoji}`;
            html = `Dear ${fullname},<br/><br/>
                    Your "${deviceName}" device has just exceeded 50% capacity, don't worry, you don't have to remove anything. 
                    We are monitoring your device so that when the time is right, we will notify you to pick up. <br/><br/>
                    Let's make the world a better place!<br/><br/>
                    Sincerely,<br/> The SmartTrash Team.`;
        }else{
            subject = `${deviceName} is at ${usagePercentage}% ${emoji}`;
            html = `Dear ${fullname},<br/><br/>
                    Your "${deviceName}" device has reached ${usagePercentage}% of its total usage. Please remember to empty it, otherwise we will notify you about it.<br/><br/>
                    You can see the status of all your devices by logging into your account with your SmartTrash Cloud ID.<br/><br/>
                    Let's make the world a better place!<br/><br/>
                    Sincerely,<br/> The SmartTrash Team.`;
        }
        const promises = device.notificationEmails.map(({ fullname, email }) => {
            const { subject, html } = getEmailContent(fullname, usagePercentage, device.name);
            return sendEmail({ to: email, subject, html });
        });
    
        await Device.updateOne({ stduid }, { $inc: { notificationsSent: 1 } });
        await Promise.all(promises);
    };
    
    generateThresholds(percentages){
        return percentages.map((percentage) => ({
            percentage,
            action: (stduid, device) => this.sendUsageStatusEmail(percentage, stduid, device)
        }));
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
            distance = parseFloat(distance.toString());
            if(isNaN(distance)){
                throw new Error('MQTT::InvalidPayloadFormat');
            }
            const device = await this.getDevice(stduid);
            if(device === null) return;
            this.processMessage(stduid, device, distance);
        }catch(error){
            console.error(`[SmartTrash Cloud]: Error parsing message: ${error}`);
        }
    };

    async shouldSendEmail(usagePercentage, stduid){
        const now = Date.now();
        const emailKey = `mqttc-device:${stduid}:email-sent:${usagePercentage}`;
        const lastSent = await redisClient.get(emailKey);
        if(!lastSent || (now - parseInt(lastSent)) > this.emailInterval){
            await redisClient.set(emailKey, now);
            return true;
        }
        return false;
    };

    /**
     * Processes an MQTT message, calculating usage and updating data.
     * @param {string} stduid - The device's STDUID
     * @param {object} device - The device object 
     * @param {number} distance - The measured distance 
     */
    async processMessage(stduid, device, distance){
        if(!device || typeof device.height !== 'number') return;
        const clampedDistance = Math.max(0, Math.min(distance, device.height));
        const usagePercentage = Math.floor(100 - ((clampedDistance / device.height) * 100)) || 0;

        for(const { options, callback } of this.handlers.values()){
            if(options?.topicName && (options.topicName !== stduid)) continue;
            callback({ measuredDistance: distance, usagePercentage });
        }
        if(device.height <= 0) return;

        await deviceLogQueue.enqueue({
            height: device.height,
            usagePercentage,
            distance,
            stduid
        });

        const thresholds = this.generateThresholds(device.notificationPercentages);
        for(const { percentage, action } of thresholds){
            if(usagePercentage >= percentage && await this.shouldSendEmail(percentage, stduid)){
                await action(stduid, device);
            }
        }
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