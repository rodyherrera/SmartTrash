#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <LittleFS.h>
#include <ArduinoJson.h>

const char* ESP8266_AP_SSID = "CleverBin-AP";
const char* ESP8266_AP_PASSWORD = "toortoor";
const unsigned short int WEB_SERVER_PORT = 80;

const char* CREDENTIALS_FILE = "/WiFiCredentials.json";

struct WiFiCredentials {
    String ssid;
    String password;
};

IPAddress localIp(192, 168, 1, 1);
IPAddress gateway(192, 168, 1, 1);
IPAddress subnet(255, 255, 255, 0);

ESP8266WebServer httpServer(WEB_SERVER_PORT);

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
const unsigned int MAX_WIFI_CONNECTION_ATTEMPS = 10;

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

const bool saveWiFiCredentials(const WiFiCredentials& credentials){
    File file = LittleFS.open(CREDENTIALS_FILE, "w"); 
    if(!file){
        Serial.println("Failed to open file for writing");
        return false;
    }

    DynamicJsonDocument doc(128);
    doc["ssid"] = credentials.ssid;
    doc["password"] = credentials.password;
    if(serializeJson(doc, file) == 0){
        Serial.println("Failed to write to file");
        return false;
    }
    file.close();
    return true;
};

WiFiCredentials loadWiFiCredentials(){
    WiFiCredentials credentials;
    File file = LittleFS.open(CREDENTIALS_FILE, "r"); 
    if(!file){
        Serial.println("Failed to open file for reading");
        return credentials;
    }

    DynamicJsonDocument doc(128);
    credentials.ssid = doc["ssid"].as<String>();
    credentials.password = doc["password"].as<String>();

    file.close();
    return credentials;
};

const bool tryWiFiConnection(){
    WiFiCredentials credentials = loadWiFiCredentials();
    if(credentials.ssid == "") return false;
    Serial.println(credentials.ssid);
    // Try to connect to the stored WiFi 
    Serial.println("Connecting to the WiFi...");
    WiFi.begin(credentials.ssid.c_str(), credentials.password.c_str());
    unsigned short int connectionAttempts = 0;
    while(WiFi.status() != WL_CONNECTED && connectionAttempts < MAX_WIFI_CONNECTION_ATTEMPS){
        delay(1000);
        Serial.print(".");
        connectionAttempts++;
    }
    if(WiFi.status() == WL_CONNECTED){
        Serial.println("Connected to WiFi.");
    }else{
        Serial.println("Failed to connect to WiFi. Deleting credentials.");
        credentials.ssid = "";
        credentials.password = "";
        saveWiFiCredentials(credentials);
    }
    return WiFi.status() == WL_CONNECTED;
};

void networkSaveController(){
    DynamicJsonDocument doc(128);
    String ssid = httpServer.arg("ssid");
    String password = httpServer.arg("password");
    
    if(ssid.isEmpty() || password.isEmpty()){
        doc["status"] = "error";
        doc["data"]["message"] = "Wifi::RequiredPasswordOrSSID";
        httpServer.send(400, "application/json", doc.as<String>());
        return;
    }

    WiFiCredentials credentials;
    credentials.ssid = ssid;
    credentials.password = password;

    const bool credentialsSaved = saveWiFiCredentials(credentials);
    if(!credentialsSaved){
        doc["status"] = "error";
        doc["data"]["message"] = "Wifi::ErrorSavingCredentials";
        httpServer.send(500, "application/json", doc.as<String>());
        return;
    }

    const bool isConnected = tryWiFiConnection();
    if(!isConnected){
        doc["status"] = "error";
        doc["data"]["message"] = "Wifi::SavedCredentialsButNotConnected";
        return;
    }

    doc["status"] = "success";
    httpServer.send(200, "application/json", doc.as<String>());
};

void homeController(){
    unsigned short int totalNetworks = WiFi.scanNetworks();
    DynamicJsonDocument doc(128);
    doc["status"] = "success";
    JsonObject data = doc.createNestedObject("data");
    JsonArray networks = data.createNestedArray("networks");
    if(totalNetworks == 0){
        doc["status"] = "error";
        doc["data"]["message"] = "Wifi::NoNetworksFound";
    }
    // This is not encapsulated within an else because, if 
    // the number of networks found is "0", the loop will 
    // simply not be executed.
    for(unsigned short int i = 0; i < totalNetworks; i++){
        JsonObject network = networks.createNestedObject();
        network["ssid"] = WiFi.SSID(i);
        network["rssi"] = WiFi.RSSI(i);
    }
    httpServer.send(200, "application/json", doc.as<String>());
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

void setupWiFiServices(){
    WiFi.softAP(ESP8266_AP_SSID, ESP8266_AP_PASSWORD);
    WiFi.softAPConfig(localIp, gateway, subnet);

    httpServer.begin();
    httpServer.enableCORS(true);
    httpServer.serveStatic("/admin-portal/", LittleFS, "/admin-portal/");
    httpServer.on("/api/v1/network/", HTTP_GET, homeController);
    httpServer.on("/api/v1/network/", HTTP_POST, networkSaveController);
    Serial.println("HTTP Server Started.");
};

void setup(){
    Serial.begin(9600);
    configureHardware();
    setupWiFiServices();
    tryWiFiConnection();
};

void loop(){
    httpServer.handleClient();
    digitalWrite(BLUE_PIN, HIGH);
    unsigned long currentTime = millis();
    if(currentTime - lastTime > MEASUREMENT_DELAY_MS){
        unsigned short int distance = getDistance();
        sendData(distance);
        lastTime = currentTime;
    }
    digitalWrite(BLUE_PIN, LOW);
};