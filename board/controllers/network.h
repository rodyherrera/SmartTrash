void handleAvailableWiFiNetworks(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    String currentWiFiSSID = WiFi.SSID();
    const bool isConnected = WiFi.status() == WL_CONNECTED;
    doc["status"] = "success";
    JsonArray networks = doc.createNestedArray("data");
    int totalNetworks = WiFi.scanComplete();
    if(totalNetworks == WIFI_SCAN_RUNNING){
        doc["status"] = "pending";
    }else if(totalNetworks == WIFI_SCAN_FAILED){
        doc["status"] = "pending";
        WiFi.scanNetworks(true);
    }else if(totalNetworks > 0){
        for(unsigned short int i = 0; i < totalNetworks; i++){
            JsonObject network = networks.createNestedObject();
            network["ssid"] = WiFi.SSID(i);
            network["isCurrent"] = currentWiFiSSID == network["ssid"] && isConnected;
        }
        WiFi.scanDelete();
    }
    request->send(200, "application/json", doc.as<String>());
};

void handleWiFiCredentialsSave(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);

    const char* plainBody = request->getParam("plain", true)->value().c_str(); 
    DeserializationError error = deserializeJson(doc, plainBody);
    if(error){
        doc.clear();
        doc["status"] = "error";
        doc["status"]["message"] = "Core::InvalidJSONFormat";
        request->send(400, "application/json", doc.as<String>());
        return;
    }

    const char* ssid = doc["ssid"];
    const char* password = doc["password"];
    if(!strlen(ssid) || !strlen(password) || !ssid || !password){
        doc.clear();
        doc["status"] = "error";
        doc["data"]["message"] = "WiFi::RequiredPasswordOrSSID";
        request->send(400, "application/json", doc.as<String>());
        return;
    }

    // TODO: remove potential additional parameters from the request body.
    if(!saveWiFiCredentials(doc)){
        doc.clear();
        doc["status"] = "error";
        doc["data"]["message"] = "Wifi::ErrorSavingCredentials";
        request->send(500, "application/json", doc.as<String>());
        return;
    }

    if(!tryWiFiConnection()){
        doc.clear();
        doc["status"] = "error";
        doc["data"]["message"] = "Wifi::SavedCredentialsButNotConnected";
        request->send(200, "application/json", doc.as<String>());
        return;
    }

    doc["status"] = "success";
    request->send(200, "application/json", doc.as<String>());
};

void removeCurrentWiFiNetwork(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    WiFi.disconnect();
    if(request->hasParam("operation") && request->getParam("operation")->value() == "DISCONNECT"){
        doc["status"] = "success";
        request->send(200, "application/json", doc.as<String>());
        return;
    }
    doc["ssid"] = "";
    doc["password"] = "";
    const bool isDeleted = saveWiFiCredentials(doc);
    if(!isDeleted){
        doc.clear();
        doc["status"] = "error";
        doc["data"]["message"] = "WiFi::RemoveCurrentNetworkError";
        request->send(500, "application/json", doc.as<String>());
        return;
    }
    doc["status"] = "success";
    request->send(200, "application/json", doc.as<String>());
};

void handleWiFiConnectionStatus(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    if(WiFi.status() != WL_CONNECTED){
        doc["status"] = "error";
        doc["data"]["message"] = "WiFi::NotConnected";
        request->send(200, "application/json", doc.as<String>());
        return;
    }
    doc["status"] = "success";
    DynamicJsonDocument currentWiFiCredentials = loadWiFiCredentials();
    doc["data"]["ssid"] = currentWiFiCredentials["ssid"];
    request->send(200, "application/json", doc.as<String>());
};