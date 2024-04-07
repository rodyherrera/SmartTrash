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
#include <ESPAsyncTCP.h>
#include <LittleFS.h>
#include <ArduinoJson.h>

#include "src/config/config.hpp"
#include "src/hardware/hardware.hpp"
#include "src/utilities/utilities.hpp"
#include "src/network/network.hpp"
#include "src/bootstrap/bootstrap.hpp"

/**
 * Measures the distance using an ultrasonic sensor.
 * 
 * Returns:
 *   - long: The distance measured in centimeters.
*/
long getDistance(){
    // Send a brief high pulse to trigger the sensor
    digitalWrite(TRIGGER_PIN, HIGH);
    // 10 microsecond pulse as per sensor requirements
    delayMicroseconds(10);
    // End the trigger pulse
    digitalWrite(TRIGGER_PIN, LOW);
    
    // Measure round-trip echo time
    long duration = pulseIn(ECHO_PIN, HIGH, DISTANCE_READ_TIMEOUT);
    // Calculate distance (speed of sound * time / 2 for round-trip)
    return duration * SPEED_OF_SOUND_CM_PER_US;
};

/**
 * Prepares a JSON message containing the measured distance and 
 * publishes it to the MQTT topic "sensors/ultrasonic".
*/
void sendDistance(){
    DynamicJsonDocument jsonDoc(64);
    jsonDoc["status"] = "success";
    jsonDoc["data"]["measuredDistance"] = getDistance();
    char jsonBuffer[64];
    serializeJson(jsonDoc, jsonBuffer);
    mqttClient.publish("sensors/ultrasonic", jsonBuffer, 2);
};

/**
 * Setup function: Initializes hardware and network services.
*/
void setup(){
    // Initialize serial communication
    Serial.begin(9600);
    // Configure essential hardware components
    Bootstrap::configureHardware();
    // Set up WiFi services (AP, server endpoints)
    Bootstrap::setupWiFiServices();
    // Attempt to connect to WiFi
    Network::tryWiFiConnection();
};

/**
 * Checks the WiFi connection status, generates a device ID 
 * if needed, and visually indicates the connection status 
 * using the on-board LED.
*/
void checkWiFiStatus(){
    // Check WiFi connection status
    const bool isConnected = WiFi.status() == WL_CONNECTED;
    // Generate device ID if connected and ID is not yet set
    if(isConnected && !stduid.length()){
        stduid = "st/" + Bootstrap::generateDeviceUID();
    }
    // LED Behavior based on connection status 
    if(!isConnected){
        for(unsigned short int i = 0; i < 10; i++){
            digitalWrite(ESP8266_LED_PIN, LOW);
            delay(150);
            digitalWrite(ESP8266_LED_PIN, HIGH);
            delay(150);
        }
        digitalWrite(ESP8266_LED_PIN, LOW);
    }
};

/**
 * Main loop: Checks for WiFi and MQTT connections, generates device ID if needed, and periodically 
 * measures and sends distance data. 
*/
void loop(){
    checkWiFiStatus();

    if(!mqttClient.connected()){
        Bootstrap::connectToMQTT();
    }

    mqttClient.loop();
    sendDistance();
};