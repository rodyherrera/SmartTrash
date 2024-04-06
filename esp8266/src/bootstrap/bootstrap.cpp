#include "bootstrap.hpp"

WiFiClient wifiClient;
PubSubClient mqttClient(wifiClient);
AsyncWebServer httpServer(WEB_SERVER_PORT);

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

void Bootstrap::connectToMQTT(){
    if(WiFi.status() != WL_CONNECTED) return;
    mqttClient.setServer(MQTT_SERVER, MQTT_SERVER_PORT);
    while(!mqttClient.connected()){
        ESP.wdtFeed();
        Serial.print("Attempting MQTT connection...");
        String clientId = "SmartTrashClient-";
        clientId += String(random(0xffff), HEX);
        if(mqttClient.connect(clientId.c_str(), MQTT_USERNAME, MQTT_PASSWORD)){
            Serial.println("Connected to MQTT server.");
            mqttClient.subscribe("sensors/ultrasonic");
        }else{
            Serial.print(" failed, rc=");
            Serial.print(mqttClient.state());
            Serial.println("Trying again in 5 seconds...");
            delay(5000);
        }
    }
};

void Bootstrap::notFoundHandler(AsyncWebServerRequest *request){
    // Cors preflight
    if(request->method() == HTTP_OPTIONS){
        request->send(200);
    }else{
        // Handle other types of not-found requests
        request->send(404, "text/plain", "Not Found"); 
    } 
};

void Bootstrap::registerServerEndpoints(){
    httpServer.serveStatic("/", LittleFS, "/").setDefaultFile("index.html");
    httpServer.on("/api/v1/network/", HTTP_POST, NetworkController::handleWiFiCredentialsSave);
    httpServer.on("/api/v1/network/", HTTP_GET, NetworkController::handleAvailableWiFiNetworks); 
    httpServer.on("/api/v1/network/", HTTP_DELETE, NetworkController::removeCurrentWiFiNetwork);
    httpServer.on("/api/v1/network/is-connected/", HTTP_GET, NetworkController::handleWiFiConnectionStatus);

    httpServer.on("/api/v1/server/restart/", HTTP_GET, ServerController::handleESPRestart);
    httpServer.on("/api/v1/server/ap-config/", HTTP_GET, ServerController::handleAccessPointConfig);
    httpServer.on("/api/v1/server/ap-config/", HTTP_PUT, ServerController::handleAccessPointConfigUpdate);
    httpServer.on("/api/v1/server/ap-config/reset/", HTTP_GET, ServerController::handleAccessPointReset);

    httpServer.on("/api/v1/auth/sign-up/", HTTP_POST, AuthController::handleSmartTrashCloudAccountCreation);
    httpServer.onNotFound(notFoundHandler);
    httpServer.begin();
};

void Bootstrap::setupWiFiServices(){
    Network::configureAccessPoint(); 
    Utilities::setupDefaultHeaders();
    registerServerEndpoints();
};