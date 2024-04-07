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
#include "../controllers/network/network.hpp"
#include "../controllers/server/server.hpp"

extern PubSubClient mqttClient;
extern WiFiClient wifiClient;
extern AsyncWebServer asyncHttpServer;

class Bootstrap{
    public:
        static void configureHardware();
        static void connectToMQTT();
        static void notFoundHandler(AsyncWebServerRequest *request);
        static void registerServerEndpoints();
        static void setupWiFiServices();
        static String generateDeviceUID();
};

#endif