#include "utilities.hpp"

const char* Utilities::buildHTTPRequest(const char* path, const char* method, const char* body, const char* contentType){
    String requestTemplate = \
        String(method) + " " + path + " HTTP/1.1\r\n" +
        "Host: " + CLOUD_SERVER_ADDRESS + ":" + String(CLOUD_SERVER_PORT) + "\r\n" +
        "Connection: close\r\n" +
        "Content-Type: " + String(contentType) + "\r\n";
    unsigned int bodyLength = strlen(body);
    if(bodyLength >= 1){
        requestTemplate += 
            "Content-Length: " + String(bodyLength) + "\r\n\r\n" +
            body;
    }
    return requestTemplate.c_str();
};

void Utilities::setupDefaultHeaders(){
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");
};

void Utilities::sendJsonResponse(AsyncWebServerRequest *request, const String &status, const DynamicJsonDocument &data){
    DynamicJsonDocument doc(128);
    doc["status"] = status;
    if(data.size() > 0) doc["data"] = data["data"];
    request->send(200, "application/json", doc.as<String>());
}

void Utilities::sendJsonError(AsyncWebServerRequest *request, unsigned short int statusCode, const String &message){
    DynamicJsonDocument doc(128);
    doc["status"] = "error";
    doc["data"]["message"] = message;
    request->send(statusCode, "application/json", doc.as<String>());
};