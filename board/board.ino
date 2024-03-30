/***
 * Copyright (C) Rodolfo Herrera Hernandez. All rights reserved.
 * Licensed under the MIT license. See LICENSE file in the project root
 * for full license information.
 *
 * =+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+=+
 *
 * For related information - https://github.com/rodyherrera/SmartTrash/
 *
 * =-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-=-
****/

#include <ESP8266WiFi.h>
#include <ESPAsyncWebServer.h>
#include <ESP8266HTTPClient.h>
#include <LittleFS.h>
#include <ArduinoJson.h>

const char* DEFAULT_ESP8266_AP_SSID = "SmartTrash-AP";
const char* DEFAULT_ESP8266_AP_PASSWORD = "toortoor";

const unsigned short int WEB_SERVER_PORT = 80;

const char* ESP8266_CONFIG_FILE = "/ESP8266Config.json";
const char* CREDENTIALS_FILE = "/WiFiCredentials.json";

IPAddress localIp(192, 168, 1, 1);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

AsyncWebServer httpServer(WEB_SERVER_PORT);

const char* SERVER_ENDPOINT = "http://172.20.10.3:5430";

// Pin connected to the trigger output of the sensor
const unsigned short int TRIGGER_PIN = D6;
// Pin connected to the echo input of the sensor
const unsigned short int ECHO_PIN = D7;
// Timeout for distance readings (microseconds)
const unsigned short int DISTANCE_READ_TIMEOUT = 30000;

// Pins for the RGB LED module
const unsigned short int RED_PIN = D1;
const unsigned short int GREEN_PIN = D2;
const unsigned short int BLUE_PIN = D3;

// Speed of sound in centimeters per microsecond.
// This constant is used for distance calculations in sensor measurements.
const float SPEED_OF_SOUND_CM_PER_US = 0.034 / 2;

const unsigned int MEASUREMENT_DELAY_MS = 3000;  
const unsigned int MAX_WIFI_CONNECTION_ATTEMPS = 15;

unsigned long lastTime = 0;

static unsigned short int getDistance(){
    // Send a brief high pulse to trigger the sensor
    digitalWrite(TRIGGER_PIN, HIGH);
    // 10 microsecond pulse as per sensor requirements
    delayMicroseconds(10);
    // End the trigger pulse
    digitalWrite(TRIGGER_PIN, LOW);
    
    // Measure round-trip echo time
    unsigned long duration = pulseIn(ECHO_PIN, HIGH, DISTANCE_READ_TIMEOUT);
    return duration * SPEED_OF_SOUND_CM_PER_US;
};

// Sends distance data to the server
void sendData(unsigned short int distance){
    if(WiFi.status() != WL_CONNECTED){
        Serial.println("WiFi not connected.");
        return;
    }
    WiFiClient client;
    HTTPClient http;
    DynamicJsonDocument body(64);
    body["measuredDistance"] = distance;
    if(!http.begin(client, SERVER_ENDPOINT)){
        Serial.println("Error connecting to the server.");
        return;
    }
    http.addHeader("Content-Type", "application/json");
    unsigned short int httpResponseCode = http.POST(body.as<String>());
    if(httpResponseCode == HTTP_CODE_OK){
        Serial.println("Data sent successfully.");
    }else{
        Serial.print("Error sending data. HTTP code: ");
        Serial.println(httpResponseCode);
    }
};

const bool saveWiFiCredentials(DynamicJsonDocument credentials){
    File file = LittleFS.open(CREDENTIALS_FILE, "w"); 
    if(!file){
        Serial.println("Failed to open file for writing");
        return false;
    }

    if(serializeJson(credentials, file) == 0){
        Serial.println("Failed to write to file");
        file.close();
        return false;
    }

    file.close();
    return true;
};

const bool saveESP8266Config(DynamicJsonDocument config){
    File file = LittleFS.open(ESP8266_CONFIG_FILE, "w");
    if(!file){
        Serial.println("Can't open the ESP8266 configuration file.");
        return false;
    }
    if(serializeJson(config, file) == 0){
        Serial.println("Error trying to write inside the ESP8266 configuration file.");
        file.close();
        return false;
    }
    file.close();
    return true;
};

DynamicJsonDocument loadDefaultESP8266Config(){
    DynamicJsonDocument defaultConfig(256);
    defaultConfig["ssid"] = DEFAULT_ESP8266_AP_SSID;
    defaultConfig["password"] = DEFAULT_ESP8266_AP_PASSWORD;
    saveESP8266Config(defaultConfig);
    return defaultConfig;
};

DynamicJsonDocument getESP8266Config(){
    File file = LittleFS.open(ESP8266_CONFIG_FILE, "r");
    if(!file){
        // I don't know if this is correct but, we will assume that if 
        // these lines of code are executed, it will be because the 
        // file does not exist, this way we will create it and add default values
        return loadDefaultESP8266Config();
    }
    DynamicJsonDocument config(256);
    // If the configuration file exists, so deserialize
    DeserializationError error = deserializeJson(config, file);
    if(error){
        Serial.println("Error trying to deserialize ESP8266 configuration file.");
        Serial.println(error.c_str());
        file.close();
        return loadDefaultESP8266Config();
    }
    file.close();
    return config;
};

DynamicJsonDocument loadWiFiCredentials(){
    DynamicJsonDocument credentials(256);
    File file = LittleFS.open(CREDENTIALS_FILE, "r"); 
    if(!file){
        Serial.println("Failed to open file for reading");
        return credentials;
    }

    DeserializationError error = deserializeJson(credentials, file);
    if(error){
        Serial.println("Failed to read from file");
        file.close();
        return credentials;
    }

    file.close();
    return credentials;
};

const bool tryWiFiConnection(){
    DynamicJsonDocument credentials = loadWiFiCredentials();
    const char* ssid = credentials["ssid"].as<const char*>();
    const char* password = credentials["password"].as<const char*>();
    WiFi.begin(ssid, password);
    Serial.println("Connecting to WiFi...");
    unsigned short int connectionAttempts = 0;
    while(WiFi.status() != WL_CONNECTED && connectionAttempts < MAX_WIFI_CONNECTION_ATTEMPS){
        delay(1000);
        Serial.print(".");
        connectionAttempts++;
    }
    if(WiFi.status() == WL_CONNECTED){
        Serial.println("Connected to WiFi.");
    }else{
        Serial.println("Failed to connect to WiFi.");
    }
    return WiFi.status() == WL_CONNECTED;
};

void isConnectedToWiFi(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    doc["status"] = "success";
    if(WiFi.status() != WL_CONNECTED){
        doc["status"] = "error";
        doc["data"]["message"] = "WiFi::NotConnected";
        request->send(200, "application/json", doc.as<String>());
        return;
    }
    DynamicJsonDocument currentWiFiCredentials = loadWiFiCredentials();
    doc["data"]["ssid"] = currentWiFiCredentials["ssid"];
    request->send(200, "application/json", doc.as<String>());
};

void networkSaveController(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(128);
    String plainBody = request->getParam("plain", true)->value(); 

    DynamicJsonDocument body(128);
    DeserializationError error = deserializeJson(body, plainBody);
    
    if(error){
        Serial.print("deserializeJson() failed: ");
        Serial.println(error.c_str());
        request->send(400, "application/json", "Bad Request");
        return;
    }

    const char* ssid = body["ssid"];
    const char* password = body["password"];

    if(!strlen(ssid) || !strlen(password)){
        doc["status"] = "error";
        doc["data"]["message"] = "Wifi::RequiredPasswordOrSSID";
        request->send(400, "application/json", doc.as<String>());
        return;
    }

    // TODO: remove potential additional parameters from the request body.
    const bool credentialsSaved = saveWiFiCredentials(body);
    if(!credentialsSaved){
        doc["status"] = "error";
        doc["data"]["message"] = "Wifi::ErrorSavingCredentials";
        request->send(500, "application/json", doc.as<String>());
        return;
    }

    const bool isConnected = tryWiFiConnection();
    if(!isConnected){
        doc["status"] = "error";
        doc["data"]["message"] = "Wifi::SavedCredentialsButNotConnected";
        request->send(200, "application/json", doc.as<String>());
        return;
    }

    doc["status"] = "success";
    request->send(200, "application/json", doc.as<String>());
};

void availableWiFiNetworks(AsyncWebServerRequest *request){
    DynamicJsonDocument doc(256);
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
        }
        WiFi.scanDelete();
    }
    request->send(200, "application/json", doc.as<String>());
};

void configureHardware(){
    if(!LittleFS.begin()){ 
        Serial.println("Failed to initialize LittleFS");
        return;
    }

    pinMode(TRIGGER_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(RED_PIN, OUTPUT);
    pinMode(BLUE_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
};

void notFoundHandler(AsyncWebServerRequest *request){
    // Cors preflight
    if(request->method() == HTTP_OPTIONS){
        request->send(200);
    }else{
        // Handle other types of not-found requests
        request->send(404, "text/plain", "Not Found"); 
    } 
}


void setupWiFiServices(){
    // NOTE: Here, you obtain the "ssid" and "password" 
    // related to the access point that is created from the ESP8266.
    DynamicJsonDocument ESP8266Config = getESP8266Config();
    const char* ssid = ESP8266Config["ssid"].as<const char*>();
    const char* password = ESP8266Config["password"].as<const char*>();

    WiFi.softAP(ssid, password);
    WiFi.softAPConfig(localIp, gateway, subnet);
  
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PUT");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");

    httpServer.serveStatic("/admin-portal/", LittleFS, "/admin-portal/");
    httpServer.on("/api/v1/network/", HTTP_POST, networkSaveController);
    httpServer.on("/api/v1/network/", HTTP_GET, availableWiFiNetworks); 
    httpServer.on("/api/v1/network/is-connected/", HTTP_GET, isConnectedToWiFi);
    httpServer.onNotFound(notFoundHandler);

    httpServer.begin();
    Serial.println("HTTP Server Started.");
};

void setup(){
    Serial.begin(9600);
    configureHardware();
    setupWiFiServices();
    tryWiFiConnection();
};

void loop(){
    digitalWrite(BLUE_PIN, HIGH);
    digitalWrite(BLUE_PIN, LOW);
};