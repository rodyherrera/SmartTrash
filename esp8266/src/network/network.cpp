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

#include "network.hpp"

/**
 * Attempts to establish a WiFi connection using stored credentials.
 *
 * Returns:
 *   - bool: True if the connection was successful, false otherwise.
*/
const bool Network::tryWiFiConnection(){
    DynamicJsonDocument credentials = FileSystem::loadWiFiCredentials();

    // Early exit if credentials are missing
    if(!credentials.containsKey("ssid") || !credentials.containsKey("password")){
        Serial.println("[SmartTrash]: Missing WiFi credentials.");
        return false;
    }

    const char* ssid = credentials["ssid"];
    const char* password = credentials["password"];
    
    // Initiate Connection
    WiFi.begin(ssid, password);
    Serial.println("[SmartTrash]: Connecting to WiFi...");

    // Connection Attempt Loop (with watchdog timer)
    for(unsigned short int attempts = 0; 
            attempts < MAX_WIFI_CONNECTION_ATTEMPS && WiFi.status() != WL_CONNECTED;
            attempts++){
        // Keep the watchdog timer happy
        ESP.wdtFeed();
        delay(500);
    }

    // Return Connection Status
    return WiFi.status() == WL_CONNECTED;
};

/**
 * Configures the ESP8266 as a WiFi access point using settings from the file system.
*/
void Network::configureAccessPoint(){
    DynamicJsonDocument ESP8266Config = FileSystem::getESP8266Config();
    // Early exit if config is missing
    if(!ESP8266Config.containsKey("ssid") || !ESP8266Config.containsKey("password")){
        Serial.println("[SmartTrash]: Missing ESP8266 access point configuration.");
        return; 
    }
    const char* ssid = ESP8266Config["ssid"].as<const char*>();
    const char* password = ESP8266Config["password"].as<const char*>();
    // Start Access Point
    WiFi.softAP(ssid, password, 1, false, 8);
    // Configure Access Point Settings 
    WiFi.softAPConfig(localIp, gateway, subnet);
};