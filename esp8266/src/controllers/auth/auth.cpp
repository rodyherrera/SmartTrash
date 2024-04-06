#include "auth.hpp"

Ticker ticker;

void AuthController::handleSmartTrashCloudAccountCreation(AsyncWebServerRequest *request){
    if(WiFi.status() != WL_CONNECTED){  
        DynamicJsonDocument doc(64);
        doc["status"] = "error";
        doc["data"]["message"] = "WiFi::NotConnected";
        request->send(400, "application/json", doc.as<String>());
        return;
    }

    DynamicJsonDocument doc(512);
    String stpuid = Utilities::generateUID();
    doc["struid"] = struid;
    doc["stpuid"] = stpuid;
    const bool isPublished = mqttClient.publish("backend/users/create", doc.as<String>().c_str());
    if(!isPublished) return;

    ticker.once(2, [=](){
        unsigned short int attemps = 0;
        
        while(!mqttResponses.containsKey(stpuid) && attemps <= 15){
            ESP.wdtFeed();
            attemps++;
            Serial.print("AuthController - ");
            Serial.println(mqttResponses.as<String>());
            delay(300);
        }

        request->send(200, "application/json", mqttResponses[stpuid].as<String>());
        mqttResponses.remove(stpuid);
    });

};
