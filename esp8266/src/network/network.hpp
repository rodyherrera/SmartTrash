#ifndef NETWORK_H
#define NETWORK_H

#include <WiFiClient.h>
#include <ESP8266WiFi.h>

#include "../config/config.hpp"
#include "../filesystem/filesystem.hpp"

class Network{
    public:
        const static bool tryWiFiConnection();
        static void configureAccessPoint();
};

#endif