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

#ifndef FILESYSTEM_H
#define FILESYSTEM_H

#include <LittleFS.h>
#include <ArduinoJson.h>

#include "../config/config.hpp"
#include "../utilities/utilities.hpp"

class FileSystem{
    public:
        const static bool saveWiFiCredentials(const DynamicJsonDocument &credentials);
        const static bool saveESP8266Config(const DynamicJsonDocument &config);
        static DynamicJsonDocument loadDefaultESP8266Config();
        static DynamicJsonDocument getESP8266Config();
        static DynamicJsonDocument loadWiFiCredentials();
};

#endif