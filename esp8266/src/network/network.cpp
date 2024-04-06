#include "network.hpp"

const bool Network::tryWiFiConnection(){
    DynamicJsonDocument credentials = FileSystem::loadWiFiCredentials();

    if(!credentials.containsKey("ssid") || !credentials.containsKey("password")){
        Serial.println("Missing WiFi credentials.");
        return false;
    }

    const char* ssid = credentials["ssid"];
    const char* password = credentials["password"];
    
    WiFi.begin(ssid, password);
    Serial.println("Connecting to WiFi...");

    unsigned short int connectionAttempts = 0;

    while(WiFi.status() != WL_CONNECTED && connectionAttempts < MAX_WIFI_CONNECTION_ATTEMPS){
        ESP.wdtFeed();
        connectionAttempts++;
        delay(500);
    }

    return WiFi.status() == WL_CONNECTED;
};

void Network::configureAccessPoint(){
    DynamicJsonDocument ESP8266Config = FileSystem::getESP8266Config();
    const char* ssid = ESP8266Config["ssid"].as<const char*>();
    const char* password = ESP8266Config["password"].as<const char*>();
    WiFi.softAP(ssid, password, 1, false, 8);
    WiFi.softAPConfig(localIp, gateway, subnet);
};