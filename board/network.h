#ifndef NETWORK_H
#define NETWORK_H

#include <WiFiClient.h>

#include "config.h"
#include "filesystem.h"

const bool tryWiFiConnection(){
    DynamicJsonDocument credentials = loadWiFiCredentials();

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
        delay(500);
        connectionAttempts++;
        ESP.wdtFeed();
    }

    const bool isConnected = WiFi.status() == WL_CONNECTED;
    
    if(isConnected){
        Serial.println("Connected to WiFi.");
    }else{
        Serial.println("Failed to connect to WiFi.");
    }
    return isConnected;
};

void configureAccessPoint(){
    DynamicJsonDocument ESP8266Config = getESP8266Config();
    const char* ssid = ESP8266Config["ssid"].as<const char*>();
    const char* password = ESP8266Config["password"].as<const char*>();
    WiFi.softAP(ssid, password, 1, false, 8);
    WiFi.softAPConfig(localIp, gateway, subnet);
};

#endif
