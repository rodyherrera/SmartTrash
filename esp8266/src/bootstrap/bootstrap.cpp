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

#include "bootstrap.hpp"

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
AsyncWebServer asyncHttpServer(WEB_SERVER_PORT);

/**
 * Configures essential hardware components.
 * 
 * Initializes the LittleFS filesystem and configures various input
 * and output pins for the device.
*/
void Bootstrap::configureHardware(){
    if(!LittleFS.begin()){ 
        Serial.println("[SmartTrash]: Failed to initialize LittleFS");
        return;
    }
    
    pinMode(TRIGGER_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(ESP8266_LED_PIN, OUTPUT);
};

/**
 * Generates a unique device identifier (UID) based on the MAC address.
 * 
 * Returns:
 *   - String: The generated device UID.
*/
String Bootstrap::generateDeviceUID(){
    String macAddress = WiFi.macAddress();
    macAddress.replace(":", "");
    return macAddress;
};

/**
 * Establishes a connection to the MQTT server.
 *
 * Handles connection attempts and subscribes to relevant MQTT topics.
 * No parameters, no return value (void function).  
*/
void Bootstrap::connectToMQTT(){
    // Early exit if WiFi isn't connected
    if(WiFi.status() != WL_CONNECTED) return;
    mqttClient.setServer(MQTT_SERVER, MQTT_SERVER_PORT);
    while(!mqttClient.connected()){
        ESP.wdtFeed();
        Serial.println("[SmartTrash]: Attempting MQTT connection...");
        if(mqttClient.connect(stduid.c_str(), MQTT_USERNAME, MQTT_PASSWORD)){
            Serial.println("[SmartTrash]: Connected to MQTT server.");
            mqttClient.subscribe("sensors/ultrasonic");
            mqttClient.subscribe(stduid.c_str());
            break;
        }else{
            Serial.println("[SmartTrash]: Failed trying connect to MQTT server.");
            delay(500);
        }
    }
};

/**
 * Handles requests for non-existing URLs.
 *
 * - Parameter:
 *      - request: (AsyncWebServerRequest *) The current web server request.
 *
 * - No return value (void function)
 */
void Bootstrap::notFoundHandler(AsyncWebServerRequest *request){
    // Cors preflight
    if(request->method() == HTTP_OPTIONS){
        request->send(200);
        return;
    }
    // In case the server receives a request that has not been 
    // registered, we assume that some endpoint that corresponds to 
    // the react application of the administration portal is 
    // being requested. If this is not the case, that application 
    // will take care of the 404 error.
    request->redirect("/");
};

/**
 * Registers HTTP endpoints for the web server.
 *
 * Associates specific URL patterns with controller functions 
 * and handles static file serving. 
 * No parameters, no return value (void function).
*/
void Bootstrap::registerServerEndpoints(){
    Serial.println("[SmartTrash]: Mounting local web server endpoints...");
    asyncHttpServer
        .serveStatic("/", LittleFS, "/")
        .setDefaultFile("index.html");

    asyncHttpServer.on("/api/v1/network/", HTTP_POST, NetworkController::handleWiFiCredentialsSave);
    asyncHttpServer.on("/api/v1/network/", HTTP_GET, NetworkController::handleAvailableWiFiNetworks); 
    asyncHttpServer.on("/api/v1/network/", HTTP_DELETE, NetworkController::removeCurrentWiFiNetwork);
    asyncHttpServer.on("/api/v1/network/is-connected/", HTTP_GET, NetworkController::handleWiFiConnectionStatus);

    asyncHttpServer.on("/api/v1/server/restart/", HTTP_GET, ServerController::handleESPRestart);
    asyncHttpServer.on("/api/v1/server/device-uid/", HTTP_GET, ServerController::handleGetDeviceUID);
    asyncHttpServer.on("/api/v1/server/ap-config/", HTTP_GET, ServerController::handleAccessPointConfig);
    asyncHttpServer.on("/api/v1/server/ap-config/", HTTP_PUT, ServerController::handleAccessPointConfigUpdate);
    asyncHttpServer.on("/api/v1/server/ap-config/reset/", HTTP_GET, ServerController::handleAccessPointReset);

    asyncHttpServer.onNotFound(notFoundHandler);
    asyncHttpServer.begin();
    Serial.println("[SmartTrash]: Apparently all endpoints mounted correctly.");
};

/**
 * Sets up WiFi services, including access point configuration, 
 * HTTP server endpoints, and default HTTP headers.
 * 
 * No parameters, no return value (void function).
*/
void Bootstrap::setupWiFiServices(){
    Network::configureAccessPoint(); 
    Utilities::setupDefaultHeaders();
    registerServerEndpoints();
    Serial.println("[SmartTrash]: Network and related services configured.");
};