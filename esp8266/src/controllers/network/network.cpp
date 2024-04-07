#include "network.hpp"

void NetworkController::handleAvailableWiFiNetworks(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    const String currentWiFiSSID = WiFi.SSID();
    const bool isConnected = WiFi.status() == WL_CONNECTED;
    short int totalNetworks = WiFi.scanComplete();

    if(totalNetworks == WIFI_SCAN_RUNNING){
        Utilities::sendJsonResponse(request, "pending");
    }else if(totalNetworks == WIFI_SCAN_FAILED){
        Utilities::sendJsonResponse(request, "pending");
        WiFi.scanNetworks(true);
    }else if(totalNetworks > 0){
        JsonArray networks = doc.createNestedArray("data");
        for(unsigned short int i = 0; i < totalNetworks; i++){
            JsonObject network = networks.createNestedObject();
            network["ssid"] = WiFi.SSID(i);
            network["isCurrent"] = currentWiFiSSID == network["ssid"] && isConnected;
        }
        WiFi.scanDelete();
    }

    Utilities::sendJsonResponse(request, "success", doc);
};

void NetworkController::handleWiFiCredentialsSave(AsyncWebServerRequest *request){
    const char* plainBody = request->getParam("plain", true)->value().c_str(); 
    DynamicJsonDocument doc(128);
    DeserializationError error = deserializeJson(doc, plainBody);
    if(error){
        Utilities::sendJsonError(request, 400, "Core::InvalidJSONFormat");
        return;
    }

    const char* ssid = doc["ssid"];
    const char* password = doc["password"];
    if(!ssid || !password){
        Utilities::sendJsonError(request, 400, "WiFi::RequiredPasswordOrSSID");
        return;
    }

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

void NetworkController::removeCurrentWiFiNetwork(AsyncWebServerRequest *request){
    WiFi.disconnect();
    if(request->hasParam("operation") && request->getParam("operation")->value() == "DISCONNECT"){
        Utilities::sendJsonResponse(request, "success");
        return;
    }
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

void NetworkController::handleWiFiConnectionStatus(AsyncWebServerRequest *request){
    if(WiFi.status() != WL_CONNECTED){
        Utilities::sendJsonError(request, 200, "WiFi::NotConnected");
        return;
    }
    DynamicJsonDocument doc(128);
    DynamicJsonDocument currentWiFiCredentials = FileSystem::loadWiFiCredentials();
    doc["data"]["ssid"] = currentWiFiCredentials["ssid"];
    Utilities::sendJsonResponse(request, "success", doc);
};