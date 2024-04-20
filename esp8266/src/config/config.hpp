/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/rodyherrera/SmartTrash/
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
****/

#ifndef CONFIG_H
#define CONFIG_H

#include <ArduinoJson.h>
#include <ESP8266WiFi.h>

extern const char* DEFAULT_ESP8266_AP_SSID;
extern const char* DEFAULT_ESP8266_AP_PASSWORD;
extern const char* ESP8266_CONFIG_FILE;
extern const char* CREDENTIALS_FILE;
extern const char* MQTT_SERVER;
extern const uint8_t MEDIAN_SAMPLES;
extern const char* MQTT_USERNAME;
extern const char* MQTT_PASSWORD;
extern const uint16_t MQTT_SERVER_PORT;
extern const IPAddress localIp;
extern const IPAddress gateway;
extern const IPAddress subnet;
extern const uint16_t WEB_SERVER_PORT;
extern const uint32_t DISTANCE_READ_TIMEOUT;
extern const uint32_t MEASUREMENT_DELAY_MS;
extern const float SPEED_OF_SOUND_CM_PER_US;
extern const uint8_t MAX_WIFI_CONNECTION_ATTEMPS;
extern String stduid;

#endif
