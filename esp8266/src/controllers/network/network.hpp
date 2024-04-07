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

#ifndef NETWORK_CONTROLLER_H
#define NETWORK_CONTROLLER_H

#include <ESPAsyncWebServer.h>

#include "../../network/network.hpp"
#include "../../filesystem/filesystem.hpp"
#include "../../utilities/utilities.hpp"

class NetworkController{
    public:
        static void handleAvailableWiFiNetworks(AsyncWebServerRequest *request);
        static void handleWiFiCredentialsSave(AsyncWebServerRequest *request);
        static void removeCurrentWiFiNetwork(AsyncWebServerRequest *request);
        static void handleWiFiConnectionStatus(AsyncWebServerRequest *request);
};

#endif