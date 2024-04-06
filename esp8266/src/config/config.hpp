#ifndef CONFIG_H
#define CONFIG_H

#include <WiFiClient.h>
#include <ArduinoJson.h>

extern const char* DEFAULT_ESP8266_AP_SSID;
extern const char* DEFAULT_ESP8266_AP_PASSWORD;
extern const char* ESP8266_CONFIG_FILE;
extern const char* CREDENTIALS_FILE;
extern const char* CLOUD_SERVER_ADDRESS;
extern const char* MQTT_SERVER;
extern const char* MQTT_USERNAME;
extern const char* MQTT_PASSWORD;
extern const uint16_t MQTT_SERVER_PORT;
extern const IPAddress localIp;
extern const IPAddress gateway;
extern const IPAddress subnet;
extern const uint16_t CLOUD_SERVER_PORT;
extern const uint16_t WEB_SERVER_PORT;
extern const uint32_t DISTANCE_READ_TIMEOUT;
extern const uint32_t MEASUREMENT_DELAY_MS;
extern const float SPEED_OF_SOUND_CM_PER_US;
extern const uint8_t MAX_WIFI_CONNECTION_ATTEMPS;
extern String struid;

extern DynamicJsonDocument mqttResponses;

#endif
