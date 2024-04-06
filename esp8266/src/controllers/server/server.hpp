#ifndef SERVER_CONTROLLER_H
#define SERVER_CONTROLLER_H

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

#include "../../filesystem/filesystem.hpp"

class ServerController{
    public:
      static void handleAccessPointReset(AsyncWebServerRequest *request);
      static void handleESPRestart(AsyncWebServerRequest *request);
      static void handleAccessPointConfigUpdate(AsyncWebServerRequest *request);
      static void handleAccessPointConfig(AsyncWebServerRequest *request);
      static void handleGetDeviceUID(AsyncWebServerRequest *request);
};

#endif