#ifndef NETWORK_CONTROLLER_H
#define NETWORK_CONTROLLER_H

#include <ESPAsyncWebServer.h>

#include "../../network/network.hpp"
#include "../../filesystem/filesystem.hpp"

class NetworkController{
    public:
        static void handleAvailableWiFiNetworks(AsyncWebServerRequest *request);
        static void handleWiFiCredentialsSave(AsyncWebServerRequest *request);
        static void removeCurrentWiFiNetwork(AsyncWebServerRequest *request);
        static void handleWiFiConnectionStatus(AsyncWebServerRequest *request);
};

#endif