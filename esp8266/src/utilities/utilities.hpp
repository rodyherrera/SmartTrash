#ifndef UTILITIES_HPP
#define UTILITIES_HPP

#include <ArduinoJson.h>
#include <LittleFS.h>
#include <ESPAsyncWebServer.h>
#include <random>

#include "../config/config.hpp"
#include "../filesystem/filesystem.hpp"

class Utilities{
    public:
        static const char* buildHTTPRequest(const char* path, const char* method = "GET",  const char* body = "", const char* contentType = "application/json");
        static void setupDefaultHeaders();
        static void sendJsonResponse(AsyncWebServerRequest *request, const String &status, const DynamicJsonDocument &data = DynamicJsonDocument(0));
        static void sendJsonError(AsyncWebServerRequest *request, unsigned short int statusCode, const String &message);
};

#endif