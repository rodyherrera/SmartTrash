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

long getDistance(){
    // Send a brief high pulse to trigger the sensor
    digitalWrite(TRIGGER_PIN, HIGH);
    // 10 microsecond pulse as per sensor requirements
    delayMicroseconds(10);
    // End the trigger pulse
    digitalWrite(TRIGGER_PIN, LOW);
    
    // Measure round-trip echo time
    long duration = pulseIn(ECHO_PIN, HIGH, DISTANCE_READ_TIMEOUT);
    return duration * SPEED_OF_SOUND_CM_PER_US;
};

void mqttCallback(char* topic, byte* payload, unsigned int length){
    if(!struid.compareTo(topic)) return;
    byte* message = (byte*)malloc(length);
    memcpy(message, payload, length);
    DynamicJsonDocument doc(128);
    DeserializationError error = deserializeJson(doc, message);
    if(!error){
        mqttResponses[doc["responseId"]] = doc["data"];
    }
    free(message);
};

void setup(){
    Serial.begin(9600);
    randomSeed(analogRead(0));
    struid += Utilities::generateUID();
    mqttClient.setCallback(mqttCallback);
    Bootstrap::configureHardware();
    Bootstrap::setupWiFiServices();
    Network::tryWiFiConnection();
};

void sendDistance(){
    DynamicJsonDocument jsonDoc(64);
    jsonDoc["status"] = "success";
    jsonDoc["data"]["measuredDistance"] = getDistance();
    char jsonBuffer[64];
    serializeJson(jsonDoc, jsonBuffer);
    mqttClient.publish("sensors/ultrasonic", jsonBuffer);
};

void loop(){
    if(!mqttClient.connected()) Bootstrap::connectToMQTT();
    mqttClient.loop();
    Serial.println(struid);
    sendDistance();
};