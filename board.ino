#include <ESP8266WiFi.h>
#include <ESP8266WebServer.h>
#include <ESP8266HTTPClient.h>
#include <FS.h>
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
    DynamicJsonDocument body(100);
    body["measuredDistance"] = distance;
    String jsonPayload;
    serializeJson(body, jsonPayload);
    if(!http.begin(client, SERVER_ENDPOINT)){
        Serial.println("Error connecting to the server.");
        return;
    }
    http.addHeader("Content-Type", "application/json");
    unsigned short int httpResponseCode = http.POST(jsonPayload);
    if(httpResponseCode == HTTP_CODE_OK){
        Serial.println("Data sent successfully.");
    }else{
        Serial.print("Error sending data. HTTP code: ");
        Serial.println(httpResponseCode);
    }
};

void saveWiFiCredentials(const WiFiCredentials& credentials){
    File file = SPIFFS.open(CREDENTIALS_FILE, "w");
    if(!file){
        Serial.println("Failed to open file for writing");
        return;
    }

    DynamicJsonDocument doc(128);
    doc["ssid"] = credentials.ssid;
    doc["password"] = credentials.password;
    if(serializeJson(doc, file) == 0){
        Serial.println("Failed to write to file");
    }
    file.close();
};

WiFiCredentials loadWiFiCredentials(){
    WiFiCredentials credentials;
    File file = SPIFFS.open(CREDENTIALS_FILE, "r");
    if(!file){
        Serial.println("Failed to open file for reading");
        return credentials;
    }

    DynamicJsonDocument doc(128);
    DeserializationError error = deserializeJson(doc, file);
    if(error){
        Serial.println("Failed to parse file");
    }else{
        credentials.ssid = doc["ssid"].as<String>();
        credentials.password = doc["password"].as<String>();
    }

    file.close();
    return credentials;
};

String getNetworksHTML(){
    String networksHTML = "<form id='networkForm' action='/save_credentials' method='post'><ul>";
    unsigned short int totalNetworks = WiFi.scanNetworks();
    if(totalNetworks == 0){
        networksHTML = "<p>No networks found</p>";
    }
    for(unsigned short int i = 0; i < totalNetworks; i++){
        networksHTML += "<li><button type='button' onclick='selectNetwork(\"" + WiFi.SSID(i) + "\")'>" + WiFi.SSID(i) + "</button></li>";
    }
    networksHTML += "</ul>";
    networksHTML += "<input type='password' id='passwordInput' name='password' style='display:none;'>";
    networksHTML += "<input type='hidden' id='selectedSSID' name='ssid'>";
    networksHTML += "<input type='submit' value='Connect'></form>";
    networksHTML += "<script>function selectNetwork(ssid) { document.getElementById('passwordInput').style.display = 'block'; document.getElementById('selectedSSID').value = ssid; }</script>";
    return networksHTML;
};

void networkSaveController(){
    if(httpServer.method() == HTTP_POST){
        String ssid = httpServer.arg("ssid");
        String password = httpServer.arg("password");
        WiFiCredentials credentials;
        credentials.ssid = ssid;
        credentials.password = password;
        saveWiFiCredentials(credentials);

        Serial.println("Connecting to WiFi...");
        WiFi.begin(ssid.c_str(), password.c_str());
        unsigned short int attemps = 0;
        Serial.println(ssid);
        Serial.println(password);
        while(WiFi.status() != WL_CONNECTED && attemps < 10){
            delay(1000);
            Serial.print(".");
            attemps++;
        }
        if(WiFi.status() == WL_CONNECTED){
            Serial.println("Connected to WiFi.");
            httpServer.send(200, "text/plain", "Credentials saved and connected to WiFi.");
        }else{
            Serial.println("Failed to connect to WiFi.");
            httpServer.send(200, "text/plain", "Credentials saved but failed to connect to WiFi.");
        }
    }else{
        httpServer.send(405, "text/plain", "Method Not Allowed");
    }
};

void homeController(){
    httpServer.send(200, "text/html", getNetworksHTML());
};

void setup(){
    Serial.begin(9600);

    if(!SPIFFS.begin()){
        Serial.println("Failed to initialize SPIFFS");
        return;
    }

    // Configures hardware pins for the project.
    pinMode(TRIGGER_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(RED_PIN, OUTPUT);
    pinMode(BLUE_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);

    WiFi.softAP(ESP8266_AP_SSID, ESP8266_AP_PASSWORD);
    WiFi.softAPConfig(localIp, gateway, subnet);

    httpServer.on("/", homeController);
    httpServer.on("/save_credentials", HTTP_POST, networkSaveController);
    httpServer.begin();
    Serial.println("HTTP Server Started.");

    WiFiCredentials credentials = loadWiFiCredentials();
    Serial.println(credentials.ssid);
    if(credentials.ssid != ""){
        // Try to connect to the stored WiFi
        Serial.println("Connecting to the WiFi...");
        WiFi.begin(credentials.ssid.c_str(), credentials.password.c_str());
        unsigned short int attempts = 0;
        while(WiFi.status() != WL_CONNECTED && attempts < 10){
            delay(1000);
            Serial.print(".");
            attempts++;
        }
        if(WiFi.status() == WL_CONNECTED){
            Serial.println("Connected to WiFi.");
        }else{
            Serial.println("Failed to connect to WiFi. Deleting credentials.");
            credentials.ssid = "";
            credentials.password = "";
            saveWiFiCredentials(credentials);
        }
    }
};

void loop(){
    httpServer.handleClient();
    digitalWrite(GREEN_PIN, HIGH);
    unsigned long currentTime = millis();
    if(currentTime - lastTime > MEASUREMENT_DELAY_MS){
        unsigned short int distance = getDistance();
        sendData(distance);
        lastTime = currentTime;
    }
    digitalWrite(GREEN_PIN, LOW);
};