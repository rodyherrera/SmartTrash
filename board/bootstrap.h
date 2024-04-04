#ifndef BOOTSTRAP_H
#define BOOTSTRAP_H

#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <LittleFS.h>
#include <PubSubClient.h>
#include <ESPAsyncWebServer.h>

#include "hardware.h"
#include "utilities.h"
#include "network.h"
#include "controllers/auth.h"
#include "controllers/network.h"
#include "controllers/server.h"

WiFiClient wifiClient;
PubSubClient psClient(wifiClient);
AsyncWebServer httpServer(WEB_SERVER_PORT);

void configureHardware(){
    if(!LittleFS.begin()){ 
        Serial.println("Failed to initialize LittleFS");
        return;
    }
    pinMode(TRIGGER_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(RED_PIN, OUTPUT);
    pinMode(BLUE_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
};

void connectToMQTT(){
    if(WiFi.status() != WL_CONNECTED) return;
    psClient.setServer(MQTT_SERVER, MQTT_SERVER_PORT);
    while(!psClient.connected()){
        ESP.wdtFeed();
        Serial.print("Attempting MQTT connection...");
        String clientId = "SmartTrashClient-";
        clientId += String(random(0xffff), HEX);
        if(psClient.connect(clientId.c_str(), MQTT_USERNAME, MQTT_PASSWORD)){
            Serial.println("Connected to MQTT server.");
            psClient.subscribe(MQTT_USENSOR_TOPIC);
        }else{
            Serial.print(" failed, rc=");
            Serial.print(psClient.state());
            Serial.println("Trying again in 5 seconds...");
            delay(5000);
        }
    }
};

void notFoundHandler(AsyncWebServerRequest *request){
    // Cors preflight
    if(request->method() == HTTP_OPTIONS){
        request->send(200);
    }else{
        // Handle other types of not-found requests
        request->send(404, "text/plain", "Not Found"); 
    } 
};

void registerServerEndpoints(){
    httpServer.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");
    httpServer.on("/api/v1/network/", HTTP_POST, handleWiFiCredentialsSave);
    httpServer.on("/api/v1/network/", HTTP_GET, handleAvailableWiFiNetworks); 
    httpServer.on("/api/v1/network/", HTTP_DELETE, removeCurrentWiFiNetwork);
    httpServer.on("/api/v1/network/is-connected/", HTTP_GET, handleWiFiConnectionStatus);

    httpServer.on("/api/v1/server/restart/", HTTP_GET, handleESPRestart);
    httpServer.on("/api/v1/server/ap-config/", HTTP_GET, handleAccessPointConfig);
    httpServer.on("/api/v1/server/ap-config/", HTTP_PUT, handleAccessPointConfigUpdate);
    httpServer.on("/api/v1/server/ap-config/reset/", HTTP_GET, handleAccessPointReset);

    httpServer.on("/api/v1/auth/sign-up/", HTTP_POST, handleSmartTrashCloudAccountCreation);
    httpServer.onNotFound(notFoundHandler);
    httpServer.begin();
};

void setupWiFiServices(){
    configureAccessPoint(); 
    setupDefaultHeaders();
    registerServerEndpoints();
};

#endif