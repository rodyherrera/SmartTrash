#include "server.hpp"

void ServerController::handleAccessPointReset(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    doc["status"] = "success";
    doc["data"] = FileSystem::loadDefaultESP8266Config();
    request->send(200, "application/json", doc.as<String>());
};


void ServerController::handleESPRestart(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(64);
    doc["status"] = "success";
    request->send(200, "application/json", doc.as<String>());
    delay(100);
    ESP.reset();
};

void ServerController::handleAccessPointConfigUpdate(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);

    const char* plainBody = request->getParam("plain", true)->value().c_str();
    DeserializationError error = deserializeJson(doc, plainBody);
    if(error){
        doc.clear();
        doc["status"] = "error";
        doc["data"]["message"] = "Core::InvalidJSONFormat";
        request->send(400, "application/json", doc.as<String>());
        return;
    }

    const char* ssid = doc["ssid"];
    const char* password = doc["password"];
    if(!strlen(ssid) || !strlen(password) || !ssid || !password){
        doc.clear();
        doc["status"] = "error";
        doc["data"]["message"] = "Server::AP::RequiredPasswordOrSSID";
        request->send(400, "application/json", doc.as<String>());
        return;
    }

    if(!FileSystem::saveESP8266Config(doc)){
        doc["status"] = "error";
        doc["data"]["message"] = "Server::AP::ErrorSavingConfig";
        request->send(500, "application/json", doc.as<String>());
        return;
    }
  
    doc["status"] = "success";
    request->send(200, "application/json", doc.as<String>());
};

void ServerController::handleAccessPointConfig(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    doc["status"] = "success";
    doc["data"] = FileSystem::getESP8266Config();
    request->send(200, "application/json", doc.as<String>());
};