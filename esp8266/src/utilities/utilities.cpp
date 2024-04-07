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

#include "utilities.hpp"

/**
 * Configures default HTTP headers, primarily for CORS (Cross-Origin Resource Sharing) purposes.
*/ 
void Utilities::setupDefaultHeaders(){
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Origin", "*");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE");
    DefaultHeaders::Instance().addHeader("Access-Control-Allow-Headers", "Content-Type");
};

/**
 * Sends a JSON response with a standard format.
 * 
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request object.
 *   - status: (const String &) The status of the response (e.g., "success", "error")
 *   - data: (const DynamicJsonDocument &) The JSON data to be included in the response.
*/
void Utilities::sendJsonResponse(AsyncWebServerRequest *request, const String &status, const DynamicJsonDocument &data){
    DynamicJsonDocument doc(128);
    doc["status"] = status;
    // Add "data" field if the provided document is not empty
    if(data.size() > 0) doc["data"] = data["data"];
    request->send(200, "application/json", doc.as<String>());
}

/**
 * Sends a JSON error response with a standard format.
 *
 * Parameters:
 *   - request: (AsyncWebServerRequest *) The current web server request object.
 *   - statusCode: (unsigned short int) The HTTP status code (e.g., 400, 500)
 *   - message: (const String &) The error message to be included in the response. 
*/
void Utilities::sendJsonError(AsyncWebServerRequest *request, unsigned short int statusCode, const String &message){
    DynamicJsonDocument doc(128);
    doc["status"] = "error";
    doc["data"]["message"] = message;
    request->send(statusCode, "application/json", doc.as<String>());
};