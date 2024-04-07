#include "network.hpp"

const bool Network::tryWiFiConnection(){
    DynamicJsonDocument credentials = FileSystem::loadWiFiCredentials();

    // Early exit if credentials are missing
    if(!credentials.containsKey("ssid") || !credentials.containsKey("password")){
        Serial.println("Missing WiFi credentials.");
        return false;
    }

    const char* ssid = credentials["ssid"];
    const char* password = credentials["password"];
    
    WiFi.begin(ssid, password);
    Serial.println("Connecting to WiFi...");

    for(unsigned short int attempts = 0; 
            attempts < MAX_WIFI_CONNECTION_ATTEMPS && WiFi.status() != WL_CONNECTED;
            attempts++){
        ESP.wdtFeed();
        delay(500);
    }

    return WiFi.status() == WL_CONNECTED;
};

void Network::configureAccessPoint(){
    DynamicJsonDocument ESP8266Config = FileSystem::getESP8266Config();
    // Early exit if config is missing
    if(!ESP8266Config.containsKey("ssid") || !ESP8266Config.containsKey("password")){
        Serial.println("Missing ESP8266 access point configuration.");
        return; 
    }
    const char* ssid = ESP8266Config["ssid"].as<const char*>();
    const char* password = ESP8266Config["password"].as<const char*>();
    WiFi.softAP(ssid, password, 1, false, 8);
    WiFi.softAPConfig(localIp, gateway, subnet);
};