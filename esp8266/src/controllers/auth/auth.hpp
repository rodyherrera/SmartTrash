#ifndef AUTH_CONTROLLER_H
#define AUTH_CONTROLLER_H

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

#include "../../utilities/utilities.hpp"

class AuthController{
    public:
        struct HttpRequestCallbackData;
        static void handleSmartTrashCloudAccountCreation(AsyncWebServerRequest *request);
};

#endif