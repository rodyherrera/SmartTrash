#include "filesystem.hpp"

const bool FileSystem::saveWiFiCredentials(DynamicJsonDocument credentials){
    File file = LittleFS.open(CREDENTIALS_FILE, "w"); 
    if(!file){
        Serial.println("Failed to open file for writing");
        return false;
    }

    if(serializeJson(credentials, file) == 0){
        Serial.println("Failed to write to file");
        file.close();
        return false;
    }

    file.close();
    return true;
};


const bool FileSystem::saveESP8266Config(DynamicJsonDocument config){
    File file = LittleFS.open(ESP8266_CONFIG_FILE, "w");
    if(!file){
        Serial.println("Can't open the ESP8266 configuration file.");
        return false;
    }
    if(serializeJson(config, file) == 0){
        Serial.println("Error trying to write inside the ESP8266 configuration file.");
        file.close();
        return false;
    }
    file.close();
    return true;
};

DynamicJsonDocument FileSystem::loadDefaultESP8266Config(){
    DynamicJsonDocument defaultConfig(128);
    defaultConfig["ssid"] = DEFAULT_ESP8266_AP_SSID;
    defaultConfig["password"] = DEFAULT_ESP8266_AP_PASSWORD;
    saveESP8266Config(defaultConfig);
    return defaultConfig;
};

DynamicJsonDocument FileSystem::getESP8266Config(){
    File file = LittleFS.open(ESP8266_CONFIG_FILE, "r");
    if(!file){
        // I don't know if this is correct but, we will assume that if 
        // these lines of code are executed, it will be because the 
        // file does not exist, this way we will create it and add default values
        return loadDefaultESP8266Config();
    }
    DynamicJsonDocument config(128);
    // If the configuration file exists, so deserialize
    DeserializationError error = deserializeJson(config, file);
    if(error){
        Serial.println("Error trying to deserialize ESP8266 configuration file.");
        Serial.println(error.c_str());
        file.close();
        return loadDefaultESP8266Config();
    }
    file.close();
    return config;
};

DynamicJsonDocument FileSystem::loadWiFiCredentials(){
    DynamicJsonDocument credentials(128);
    File file = LittleFS.open(CREDENTIALS_FILE, "r"); 
    if(!file){
        Serial.println("Failed to open file for reading");
        return credentials;
    }

    DeserializationError error = deserializeJson(credentials, file);
    if(error){
        Serial.println("Failed to read from file");
        file.close();
        return credentials;
    }

    file.close();
    return credentials;
};
