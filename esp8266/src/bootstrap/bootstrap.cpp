#include "bootstrap.hpp"

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
AsyncWebServer asyncHttpServer(WEB_SERVER_PORT);

void Bootstrap::configureHardware(){
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

String Bootstrap::generateDeviceUID(){
    String macAddress = WiFi.macAddress();
    macAddress.replace(":", "");
    return macAddress;
};

void Bootstrap::connectToMQTT(){
    if(WiFi.status() != WL_CONNECTED) return;
    mqttClient.setServer(MQTT_SERVER, MQTT_SERVER_PORT);
    while(!mqttClient.connected()){
        ESP.wdtFeed();
        Serial.println("Attempting MQTT connection...");
        if(mqttClient.connect(stduid.c_str(), MQTT_USERNAME, MQTT_PASSWORD)){
            Serial.println("Connected to MQTT server.");
            mqttClient.subscribe("sensors/ultrasonic");
            mqttClient.subscribe(stduid.c_str());
            break;
        }else{
            Serial.println("Failed trying connect to MQTT server.");
            delay(500);
        }
    }
};

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

void Bootstrap::registerServerEndpoints(){
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
};

void Bootstrap::setupWiFiServices(){
    Network::configureAccessPoint(); 
    Utilities::setupDefaultHeaders();
    registerServerEndpoints();
};