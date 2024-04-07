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

#include "network.hpp"

/**
 * Handles requests for discovering available WiFi networks.
 * 
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request
 * 
 * No explicit return value (response sent directly within the function).
*/
void NetworkController::handleAvailableWiFiNetworks(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    const String currentWiFiSSID = WiFi.SSID();
    const bool isConnected = WiFi.status() == WL_CONNECTED;
    short int totalNetworks = WiFi.scanComplete();

    // Handle scanning states
    if(totalNetworks == WIFI_SCAN_RUNNING){
        Utilities::sendJsonResponse(request, "pending");
    }else if(totalNetworks == WIFI_SCAN_FAILED){
        Utilities::sendJsonResponse(request, "pending");
        WiFi.scanNetworks(true);
        return;
    }

    // Add scan results to JSON response
    JsonArray networks = doc.createNestedArray("data");
    for(unsigned short int i = 0; i < totalNetworks; i++){
        JsonObject network = networks.createNestedObject();
        network["ssid"] = WiFi.SSID(i);
        network["isCurrent"] = currentWiFiSSID == network["ssid"] && isConnected;
    }
    // Clean up
    WiFi.scanDelete();

    Utilities::sendJsonResponse(request, "success", doc);
};

/**
 * Handles requests to save WiFi credentials.
 * 
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request
 * 
 * No explicit return value (response sent directly within the function).
*/
void NetworkController::handleWiFiCredentialsSave(AsyncWebServerRequest *request){
    const char* plainBody = request->getParam("plain", true)->value().c_str(); 
    DynamicJsonDocument doc(128);
    // Deserialize JSON payload
    DeserializationError error = deserializeJson(doc, plainBody);
    if(error){
        Utilities::sendJsonError(request, 400, "Core::InvalidJSONFormat");
        return;
    }

    // Validate credentials
    const char* ssid = doc["ssid"];
    const char* password = doc["password"];
    if(!ssid || !password){
        Utilities::sendJsonError(request, 400, "WiFi::RequiredPasswordOrSSID");
        return;
    }

    // Save and attempt connection
    if(!FileSystem::saveWiFiCredentials(doc)){
        Utilities::sendJsonError(request, 500, "WiFi::ErrorSavingCredentials");
        return;
    }

    if(!Network::tryWiFiConnection()){
        Utilities::sendJsonError(request, 200, "WiFi::SavedCredentialsButNotConnected");
        return;
    }
    Utilities::sendJsonResponse(request, "success");
};

/**
 * Handles requests to remove the current WiFi network configuration.
 * 
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request
 * 
 * No explicit return value (response sent directly within the function).
*/
void NetworkController::removeCurrentWiFiNetwork(AsyncWebServerRequest *request){
    // Disconnect first
    WiFi.disconnect();
    // Check for optional "DISCONNECT" operation
    if(request->hasParam("operation") && request->getParam("operation")->value() == "DISCONNECT"){
        Utilities::sendJsonResponse(request, "success");
        return;
    }
    // Clear WiFi credentials 
    DynamicJsonDocument doc(64);
    doc["ssid"] = "";
    doc["password"] = "";
    const bool isDeleted = FileSystem::saveWiFiCredentials(doc);
    if(!isDeleted){
        Utilities::sendJsonError(request, 500, "WiFi::RemoveCurrentNetworkError");
        return;
    }
    Utilities::sendJsonResponse(request, "success");
};

/**
 * Handles requests for the current WiFi connection status.
 *
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request object.
 *
 * No explicit return value (response sent directly within the function).
*/
void NetworkController::handleWiFiConnectionStatus(AsyncWebServerRequest *request){
    // Early Exit: If not connected to WiFi, send an error response
    if(WiFi.status() != WL_CONNECTED){
        Utilities::sendJsonError(request, 200, "WiFi::NotConnected");
        return;
    }
    DynamicJsonDocument doc(128);
    // Load the current WiFi credentials from storage 
    DynamicJsonDocument currentWiFiCredentials = FileSystem::loadWiFiCredentials();
    doc["data"]["ssid"] = currentWiFiCredentials["ssid"];
    Utilities::sendJsonResponse(request, "success", doc);
};