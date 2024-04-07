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

#include "server.hpp"

/**
 * Handles requests to reset the access point configuration.
 * 
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request
 * 
 * No explicit return value (response sent directly within the function).
*/
void ServerController::handleAccessPointReset(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    // Load the default ESP8266 configuration from the file system
    doc["data"] = FileSystem::loadDefaultESP8266Config();
    Utilities::sendJsonResponse(request, "success", doc);
};

/**
 * Handles requests to restart the ESP device.
 *
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request
 * 
 * No explicit return value (response sent directly within the function).
*/
void ServerController::handleESPRestart(AsyncWebServerRequest *request){
    Utilities::sendJsonResponse(request, "success");
    // Introduce a short delay before restarting (to allow the response to send) 
    delay(100);
    // Perform the ESP device reset 
    ESP.reset();
};

/**
 * Handles requests for the device's unique identifier (UID).
 *
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request
 * 
 * No explicit return value (response sent directly within the function).
*/
void ServerController::handleGetDeviceUID(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(64);
    doc["data"] = stduid;
    Utilities::sendJsonResponse(request, "success", doc);
};

/**
 * Handles requests to update the access point configuration
 * 
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request
 * 
 * No explicit return value (response sent directly within the function).
*/
void ServerController::handleAccessPointConfigUpdate(AsyncWebServerRequest *request){
    const char* plainBody = request->getParam("plain", true)->value().c_str();
    DynamicJsonDocument doc(128);
    // Deserialize the JSON request body
    DeserializationError error = deserializeJson(doc, plainBody);
    if(error){
        Utilities::sendJsonError(request, 400, "Core::InvalidJSONFormat");
        return;
    }

    // Validate the received configuration 
    const char* ssid = doc["ssid"];
    const char* password = doc["password"];
    if(!ssid || !password){
        Utilities::sendJsonError(request, 400, "Server::AP::RequiredPasswordOrSSID");
        return;
    }

    // Save the updated configuration
    if(!FileSystem::saveESP8266Config(doc)){
        Utilities::sendJsonError(request, 400, "Server::AP::ErrorSavingConfig");
        return;
    }
    
    Utilities::sendJsonResponse(request, "success");
};

/**
 * Handles requests to retrieve the current access point configuration
 * 
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request
 * 
 * No explicit return value (response sent directly within the function).
*/
void ServerController::handleAccessPointConfig(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    // Load the ESP8266 access point configuration
    doc["data"] = FileSystem::getESP8266Config();
    Utilities::sendJsonResponse(request, "success", doc);
};