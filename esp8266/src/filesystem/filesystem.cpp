#include "filesystem.hpp"

const bool FileSystem::saveWiFiCredentials(const DynamicJsonDocument& credentials){
    return fileOperation(CREDENTIALS_FILE, credentials, [](const DynamicJsonDocument& doc, File file) -> bool {
        return serializeJson(doc, file) > 0;
    });
}

const bool FileSystem::saveESP8266Config(const DynamicJsonDocument &config){
    return fileOperation(ESP8266_CONFIG_FILE, config, [](const DynamicJsonDocument &doc, File file){
       return serializeJson(doc, file) > 0;
    });
};

DynamicJsonDocument FileSystem::loadDefaultESP8266Config(){
    DynamicJsonDocument defaultConfig(128);
    defaultConfig["ssid"] = DEFAULT_ESP8266_AP_SSID;
    defaultConfig["password"] = DEFAULT_ESP8266_AP_PASSWORD;
    saveESP8266Config(defaultConfig);
    return defaultConfig;
};

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
