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

#ifndef UTILITIES_HPP
#define UTILITIES_HPP

#include <ArduinoJson.h>
#include <LittleFS.h>
#include <ESPAsyncWebServer.h>
#include <random>

#include "../config/config.hpp"
#include "../filesystem/filesystem.hpp"

template <typename T, typename Callable>
const bool fileOperation(const String &filename, const T &data, Callable operation, const char* mode = "w"){
    File file = LittleFS.open(filename, mode);
    if(!file){
        Serial.println("Failed to open the file.");
        return false;
    }
    if(!operation(data, file)){
        Serial.println("Failed to perform operation on file.");
        file.close();
        return false;
    }
    file.close();
    return true;
};

class Utilities{
    public:
        static void setupDefaultHeaders();
        static void sendJsonResponse(AsyncWebServerRequest *request, const String &status, const DynamicJsonDocument &data = DynamicJsonDocument(0));
        static void sendJsonError(AsyncWebServerRequest *request, unsigned short int statusCode, const String &message);
};

#endif