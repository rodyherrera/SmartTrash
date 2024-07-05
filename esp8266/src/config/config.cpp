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

#include "config.hpp"

// Default access point SSID
const char* DEFAULT_ESP8266_AP_SSID = "SmartTrash";
// Default access point password
const char* DEFAULT_ESP8266_AP_PASSWORD = "toortoor";

// Path to ESP8266 configuration file 
const char* ESP8266_CONFIG_FILE = "/ESP8266Config.json";
// Path to WiFi credentials file
const char* CREDENTIALS_FILE = "/WiFiCredentials.json";

// MQTT Configuration
const char* MQTT_SERVER = "mqtt.rodyherrera.com";
const char* MQTT_USERNAME = "rodoherrera";
const char* MQTT_PASSWORD = "55563019";
const uint16_t MQTT_SERVER_PORT = 1883;
const uint8_t MEDIAN_SAMPLES = 7;

// Network Settings
const IPAddress localIp(192, 168, 1, 1);
const IPAddress gateway(192, 168, 1, 1);
const IPAddress subnet(255, 255, 255, 0);

// Web Server Settings
const uint16_t WEB_SERVER_PORT = 80;

// Sensor Timing and Calculations
// Max time to wait for sensor echo  (microseconds)
const uint32_t DISTANCE_READ_TIMEOUT = 30000;
// Delay between distance measurements (milliseconds)
const uint32_t MEASUREMENT_DELAY_MS = 3000;  
// Speed of sound for distance calculation (cm/microsecond)
const float SPEED_OF_SOUND_CM_PER_US = 0.0343 / 2;
// Maximum WiFi connection retries
const uint8_t MAX_WIFI_CONNECTION_ATTEMPS = 15;

// Globally accessible variable to store the SmartTrash Device Unique ID
String stduid;