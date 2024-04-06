#include "config.hpp"

const char* DEFAULT_ESP8266_AP_SSID = "SmartTrash";
const char* DEFAULT_ESP8266_AP_PASSWORD = "toortoor";

const char* ESP8266_CONFIG_FILE = "/ESP8266Config.json";
const char* CREDENTIALS_FILE = "/WiFiCredentials.json";

const char* MQTT_SERVER = "mqtt.rodyherrera.com";
const char* MQTT_USERNAME = "";
const char* MQTT_PASSWORD = "";
const uint16_t MQTT_SERVER_PORT = 1883;

const char* CLOUD_SERVER_ADDRESS = "82.208.22.71";
const uint16_t CLOUD_SERVER_PORT = 3140;

const IPAddress localIp(192, 168, 1, 1);
const IPAddress gateway(192, 168, 1, 1);
const IPAddress subnet(255, 255, 255, 0);

const uint16_t WEB_SERVER_PORT = 80;
const uint32_t DISTANCE_READ_TIMEOUT = 30000;
const uint32_t MEASUREMENT_DELAY_MS = 3000;  
const float SPEED_OF_SOUND_CM_PER_US = 0.034 / 2;
const uint8_t MAX_WIFI_CONNECTION_ATTEMPS = 15;

// stduid -> SmartTrash Device Unique ID.
String stduid;