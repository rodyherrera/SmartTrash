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

String Utilities::generateUID(){
    String uid = "";
    for(unsigned short int i = 0; i < 8; i++){
        char randomChar = random(65, 91);
        uid += randomChar;
    }
    return uid;
};