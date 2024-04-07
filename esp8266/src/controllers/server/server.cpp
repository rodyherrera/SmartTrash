#include "server.hpp"

void ServerController::handleAccessPointReset(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    doc["data"] = FileSystem::loadDefaultESP8266Config();
    Utilities::sendJsonResponse(request, "success", doc);
};


void ServerController::handleESPRestart(AsyncWebServerRequest *request){
    Utilities::sendJsonResponse(request, "success");
    delay(100);
    ESP.reset();
};

void ServerController::handleGetDeviceUID(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(64);
    doc["data"] = stduid;
    Utilities::sendJsonResponse(request, "success", doc);
};

void ServerController::handleAccessPointConfigUpdate(AsyncWebServerRequest *request){
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
        Utilities::sendJsonError(request, 400, "Server::AP::RequiredPasswordOrSSID");
        return;
    }

    if(!FileSystem::saveESP8266Config(doc)){
        Utilities::sendJsonError(request, 400, "Server::AP::ErrorSavingConfig");
        return;
    }
    
    Utilities::sendJsonResponse(request, "success");
};

void ServerController::handleAccessPointConfig(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    doc["data"] = FileSystem::getESP8266Config();
    Utilities::sendJsonResponse(request, "success", doc);
};