#ifndef UTILITIES_H
#define UTILITIES_H

#include <ArduinoJson.h>
#include <LittleFS.h>
#include <ESPAsyncWebServer.h>

#include "config.h"
#include "filesystem"

const char* buildHTTPRequest(
    const char* path, 
    const char* method = "GET", 
    const char* body = "",
    const char* contentType = "application/json"
){
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

void setupDefaultHeaders(){
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");
};

#endif
