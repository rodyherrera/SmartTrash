require('./aliases');
const mqtt = require('mqtt');
const BATCH_SIZE = 100000;
const TOTAL_DOCUMENTS = 100000;
const TOPIC = 'st/4C11AE113CBF';
let client;

const generateDocuments = async (start, end) => {
  const promises = [];
  for (let i = start; i < end; i++) {
    console.log(i);
    const distance = Math.floor(Math.random() * 100) + 1;
    const promise = client.publishAsync(TOPIC, String(distance), { qos: 0 });
    promises.push(promise);
  }
  await Promise.all(promises);
};

(async () => {
  try {
    console.log('[SmartTrash Cloud]: Connecting to MQTT Server...');
     client = await mqtt.connectAsync(`mqtt://${process.env.MQTT_SERVER}:${process.env.MQTT_SERVER_PORT}`, {
      username: process.env.MQTT_USERNAME,
      password: process.env.MQTT_PASSWORD
    });

    console.log('[SmartTrash Cloud]: Connected to MQTT Server.');

    for (let i = 0; i < TOTAL_DOCUMENTS; i += BATCH_SIZE) {
      console.log('[SmartTrash Cloud] Round:', i);
      await generateDocuments(i, Math.min(i + BATCH_SIZE, TOTAL_DOCUMENTS));
    }
    console.log('[SmartTrash Cloud]: OK!');
    client.end();
  } catch (error) {
    console.error('[SmartTrash Cloud]:', error);
  }
})();