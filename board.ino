#include <ESP8266WiFi.h>
#include <ESP8266HTTPClient.h>
#include <ArduinoJson.h>

const char* WIFI_SSID = "rodyherrera";
const char* WIFI_PASSWORD = "12345678";
const char* SERVER_ENDPOINT = "http://172.20.10.3:5430";

// Pin connected to the trigger output of the sensor
const unsigned short int TRIGGER_PIN = D7;
// Pin connected to the echo input of the sensor
const unsigned short int ECHO_PIN = D6;
// Timeout for distance readings (microseconds)
const unsigned short int DISTANCE_READ_TIMEOUT = 30000;

// Pins for the RGB LED module
const unsigned short int RED_PIN = D1;
const unsigned short int GREEN_PIN = D2;
const unsigned short int BLUE_PIN = D3;

// Speed of sound in centimeters per microsecond.
// This constant is used for distance calculations in sensor measurements.
const float SPEED_OF_SOUND_CM_PER_US = 0.034 / 2;

unsigned long lasTime = 0;
unsigned short int timerDelay = 3000;

static unsigned short int getDistance(){
    // Send a brief high pulse to trigger the sensor
    digitalWrite(TRIGGER_PIN, HIGH);
    // 10 microsecond pulse as per sensor requirements
    delayMicroseconds(10);
    // End the trigger pulse
    digitalWrite(TRIGGER_PIN, LOW);
    
    // Measure round-trip echo time
    unsigned long duration = pulseIn(ECHO_PIN, HIGH, DISTANCE_READ_TIMEOUT);
    const unsigned short int distance = duration * SPEED_OF_SOUND_CM_PER_US;
    return distance;
};

void setup(){
    Serial.begin(9600);

    // Configures hardware pins for the project.
    pinMode(TRIGGER_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(RED_PIN, OUTPUT);
    pinMode(BLUE_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);

    WiFi.mode(WIFI_STA);
    WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
    while(WiFi.status() != WL_CONNECTED){
        delay(500);
        Serial.print('.');
    }
    Serial.println("");
    Serial.println("Connected to WiFi!");
    Serial.print("IP Address: ");
    Serial.println(WiFi.localIP());
};

void loop(){
    digitalWrite(GREEN_PIN, HIGH);
    if((millis() - lasTime) > timerDelay){
        // Check WiFi connection status
        if(WiFi.status() == WL_CONNECTED){
            WiFiClient client;
            HTTPClient http;

            const unsigned short int distance = getDistance();

            DynamicJsonDocument body(100);
            body["measuredDistance"] = distance;

            String jsonPayload;
            serializeJson(body, jsonPayload);

            if(http.begin(client, SERVER_ENDPOINT)){
                http.addHeader("Content-Type", "application/json");
                unsigned short int httpResponseCode = http.POST(jsonPayload);
                if(httpResponseCode == HTTP_CODE_OK){
                    Serial.println("Data sent successfully.");
                }else{
                    Serial.println("Error sending data");
                }
                http.end();
            }else{
                Serial.println("Error connecting to the server.");
            }
        }else{
            Serial.println("WiFi not connected");
        }
        lasTime = millis();
    }
    digitalWrite(GREEN_PIN, LOW);
};