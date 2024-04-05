#ifndef BOOTSTRAP_H
#define BOOTSTRAP_H

#include <WiFiClient.h>
#include <ESP8266WiFi.h>
#include <LittleFS.h>
#include <PubSubClient.h>
#include <ESPAsyncWebServer.h>

#include "../hardware/hardware.hpp"
#include "../utilities/utilities.hpp"
#include "../network/network.hpp"
#include "../controllers/auth/auth.hpp"
#include "../controllers/network/network.hpp"
#include "../controllers/server/server.hpp"

extern PubSubClient mqttClient;
extern WiFiClient wifiClient;
extern AsyncWebServer httpServer;

class Bootstrap{
    public:
        static void configureHardware();
        static void connectToMQTT();
        static void notFoundHandler(AsyncWebServerRequest *request);
        static void registerServerEndpoints();
        static void setupWiFiServices();
};

#endif