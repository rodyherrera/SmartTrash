#ifndef AUTH_CONTROLLER_H
#define AUTH_CONTROLLER_H

#include <ESPAsyncWebServer.h>
#include <ArduinoJson.h>

#include "../../utilities/utilities.hpp"
#include "../../bootstrap/bootstrap.hpp"

class AuthController{
    public:
        static void handleSmartTrashCloudAccountCreation(AsyncWebServerRequest *request);
};

#endif