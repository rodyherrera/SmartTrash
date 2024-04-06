#include "auth.hpp"

void AuthController::handleSmartTrashCloudAccountCreation(AsyncWebServerRequest *request){
    if(WiFi.status() != WL_CONNECTED){  
        DynamicJsonDocument doc(64);
        doc["status"] = "error";
        doc["data"]["message"] = "WiFi::NotConnected";
        request->send(400, "application/json", doc.as<String>());
        return;
    }

    const char* body = request->getParam("plain", true)->value().c_str();
    DynamicJsonDocument doc(256);
    DeserializationError error = deserializeJson(doc, body);
    if(error){
        doc.clear();
        doc["status"] = "error";
        doc["data"]["message"] = "Core::InvalidJSONFormat";
        request->send(400, "application/json");
        return;
    }

    String stpuid = Utilities::generateUID();
    
    doc["struid"] = struid;
    doc["stpuid"] = stpuid;
    const char* payload = doc.as<String>().c_str();
    mqttClient.publish("backend/users/create", payload);

    unsigned short int attemps = 0;
    while(!mqttResponses.containsKey(stpuid) && attemps <= 15){
        ESP.wdtFeed();
        delay(200);
        attemps++;
    }

    if(!mqttResponses.containsKey(stpuid)){
        Serial.println("NO EXISTS");
        return;
    }
    Serial.println("EXISTS!");
    mqttResponses.remove(stpuid);

    request->send(200, "application/json", "{}");
};
