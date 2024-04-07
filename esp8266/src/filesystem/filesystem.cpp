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

#include "filesystem.hpp"

/**
 * Saves WiFi credentials to the file system.
 *
 * Parameters:
 *   - credentials: (const DynamicJsonDocument&) The JSON document containing WiFi credentials. 
 *
 * Returns:
 *   - bool: True if the credentials were saved successfully, false otherwise.
*/
const bool FileSystem::saveWiFiCredentials(const DynamicJsonDocument& credentials){
    return fileOperation(CREDENTIALS_FILE, credentials, [](const DynamicJsonDocument& doc, File file) -> bool {
        return serializeJson(doc, file) > 0;
    });
}

/**
 * Saves the ESP8266 access point configuration to the file system.
 *
 * Parameters:
 *   - config: (const DynamicJsonDocument&) The JSON document containing the ESP8266 configuration.  
 *
 * Returns:
 *   - bool: True if the configuration was saved successfully, false otherwise.
*/
const bool FileSystem::saveESP8266Config(const DynamicJsonDocument &config){
    return fileOperation(ESP8266_CONFIG_FILE, config, [](const DynamicJsonDocument &doc, File file){
       return serializeJson(doc, file) > 0;
    });
};

/**
 * Loads the default ESP8266 access point configuration.
 *
 * This function also saves the default configuration if it doesn't already exist. 
 *
 * Returns:
 *   - DynamicJsonDocument: A JSON document containing the default ESP8266 configuration.
*/
DynamicJsonDocument FileSystem::loadDefaultESP8266Config(){
    DynamicJsonDocument defaultConfig(128);
    defaultConfig["ssid"] = DEFAULT_ESP8266_AP_SSID;
    defaultConfig["password"] = DEFAULT_ESP8266_AP_PASSWORD;
    saveESP8266Config(defaultConfig);
    return defaultConfig;
};

/**
 * Loads the ESP8266 access point configuration from the file system.
 *
 *  If an error occurs during deserialization, logs the error and 
 *  loads the default configuration.
 *
 * Returns:
 *   - DynamicJsonDocument: A JSON document containing the ESP8266 configuration.
*/
DynamicJsonDocument FileSystem::getESP8266Config(){
    DynamicJsonDocument config(128);
    const bool isSuccess = fileOperation(ESP8266_CONFIG_FILE, NULL, [&](const DynamicJsonDocument &doc, File file){
        DeserializationError error = deserializeJson(config, file);
        if(!error) return true;
        Serial.println("Error trying to deserialize ESP8266 configuration file.");
        Serial.println(error.c_str());
        return false;
    }, "r");
    if(!isSuccess) return loadDefaultESP8266Config();
    return config;
};

/**
 * Loads WiFi credentials from the file system.
 *
 * If an error occurs during deserialization, returns an empty JSON document.
 *
 * Returns:
 *   - DynamicJsonDocument: A JSON document containing WiFi credentials or an empty document if an error occurs.
*/
DynamicJsonDocument FileSystem::loadWiFiCredentials(){
    DynamicJsonDocument credentials(128);
    const bool isSuccess = fileOperation(CREDENTIALS_FILE, NULL, [&](const DynamicJsonDocument &doc, File file){
        DeserializationError error = deserializeJson(credentials, file);
        if(!error) return true;
        Serial.println("Failed to read from file");
        return false;
    }, "r");
    return credentials;
};
