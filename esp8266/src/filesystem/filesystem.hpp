#ifndef FILESYSTEM_H
#define FILESYSTEM_H

#include <LittleFS.h>
#include <ArduinoJson.h>

#include "../config/config.hpp"

class FileSystem{
    public:
        const static bool saveWiFiCredentials(DynamicJsonDocument credentials);
        const static bool saveESP8266Config(DynamicJsonDocument config);
        static DynamicJsonDocument loadDefaultESP8266Config();
        static DynamicJsonDocument getESP8266Config();
        static DynamicJsonDocument loadWiFiCredentials();
};

#endif