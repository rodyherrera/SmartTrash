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

#ifndef SERVER_CONTROLLER_H
#define SERVER_CONTROLLER_H

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

#include "../../filesystem/filesystem.hpp"
#include "../../utilities/utilities.hpp"

class ServerController{
    public:
      static void handleAccessPointReset(AsyncWebServerRequest *request);
      static void handleESPRestart(AsyncWebServerRequest *request);
      static void handleAccessPointConfigUpdate(AsyncWebServerRequest *request);
      static void handleAccessPointConfig(AsyncWebServerRequest *request);
      static void handleGetDeviceUID(AsyncWebServerRequest *request);
};

#endif