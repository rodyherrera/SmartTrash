#include "auth.hpp"

struct AuthController::HttpRequestCallbackData{
    void* request;
    String jsonResponse;
};

void AuthController::handleSmartTrashCloudAccountCreation(AsyncWebServerRequest *request){
    if(WiFi.status() != WL_CONNECTED){  
        DynamicJsonDocument doc(64);
        doc["status"] = "error";
        doc["data"]["message"] = "WiFi::NotConnected";
        request->send(400, "application/json", doc.as<String>());
        return;
    }

    AsyncClient *client = new AsyncClient;
    client->onConnect([](void *arg, AsyncClient *client) {
        AsyncWebServerRequest* request = (AsyncWebServerRequest *)arg;
        ESP.wdtFeed();
        
        const char* body = request->getParam("plain", true)->value().c_str();
        const char* httpRequest = Utilities::buildHTTPRequest("/api/v1/auth/sign-up/", "POST", body);
        client->write(httpRequest);

        String jsonResponse = "";
        HttpRequestCallbackData* callbackData = new HttpRequestCallbackData{ arg, jsonResponse };

        client->onData([](void *arg, AsyncClient *client, void *data, size_t len){
            ESP.wdtFeed();
            HttpRequestCallbackData* callbackData = (HttpRequestCallbackData*) arg;
            AsyncWebServerRequest* request = (AsyncWebServerRequest*) callbackData->request;
            uint8_t* bytes = (uint8_t *)data;
            String responseBuffer = String((char*)bytes);
            unsigned short int jsonStartIndex = responseBuffer.indexOf("{");
            callbackData->jsonResponse += responseBuffer.substring(jsonStartIndex);
        }, callbackData);

        client->onDisconnect([](void* arg, AsyncClient *client){
            HttpRequestCallbackData* callbackData = (HttpRequestCallbackData*) arg;
            AsyncWebServerRequest* request = (AsyncWebServerRequest*) callbackData->request;
            String jsonResponse = callbackData->jsonResponse;
            Serial.println("Disconnect");
            Serial.println(jsonResponse);
            delete callbackData;
        }, callbackData);

    }, request);
  
    client->onError([](void *arg, AsyncClient *client, int8_t error){
        ESP.wdtFeed();
        DynamicJsonDocument doc(64);
        doc["status"] = "error";
        doc["data"]["message"] = "Core::ServerConnectionError";
        AsyncWebServerRequest* request = (AsyncWebServerRequest *)arg;
        request->send(500, "application/json", doc.as<String>());
    }, request);

    client->connect(CLOUD_SERVER_ADDRESS, CLOUD_SERVER_PORT);
    ESP.wdtFeed();
}
