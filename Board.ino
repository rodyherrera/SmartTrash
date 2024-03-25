#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Pin connected to the trigger output of the sensor
#define TRIGGER_PIN 3
// Pin connected to the echo input of the sensor
#define ECHO_PIN 2

// Timeout for distance readings (microseconds)
#define DISTANCE_READ_TIMEOUT 30000
// Error LED blink count
#define ERROR_BLINK_COUNT 10
// Error LED blink delay (milliseconds)
#define ERROR_BLINK_DELAY_MS 100
// Maximum distance the sensor can read (cm)
#define MAX_SENSOR_DISTANCE 20

// Pins for the RGB LED module
#define RED_PIN 10
#define GREEN_PIN 9
#define BLUE_PIN 8

// Optional LCD object - only initialize if it's connected
LiquidCrystal_I2C *lcdPtr = 0;

// Centers text on a specified line of the LCD display
//
// Parameters:
//   text - The text string to display
//   columnIndex - The row index (0-based) where the text should be placed (default = 0)
void printCentered(const char* text, unsigned short int columnIndex = 0){
    unsigned short int textLength = strlen(text);
    unsigned short int position = (16 - textLength) / 2;
    // Check if text will fit on the LCD
    if(position >= 0 && lcdPtr != 0){
        lcdPtr->setCursor(position, columnIndex);
        lcdPtr->print(text);
    }
};

// displayUsage function
// Displays the calculated usage percentage and distance on the LCD
// 
// Parameters:
//   duration - Travel time of the ultrasonic pulse (microseconds)
void displayUsage(long duration){
    // Calculate distance in centimeters
    float distance = duration * 0.034 / 2;
    float usagePercentage = calculateUsagePercentage(distance);

    if(lcdPtr != 0){
        lcdPtr->clear();
        printCentered("Usage");
        char displayStringBuffer[30];
        sprintf(displayStringBuffer, "%d%% - %d cm", (int)usagePercentage, (int)distance);
        printCentered(displayStringBuffer, 1);
    }

    const bool isPercentageCorrect = usagePercentage < 100.0f;
    // Light error LED if issue
    digitalWrite(RED_PIN, !isPercentageCorrect);
    // Light blue LED if OK
    digitalWrite(BLUE_PIN, isPercentageCorrect);
    delay(500);
    digitalWrite(BLUE_PIN, LOW);
};

// displaySensorError function
// Displays an error message on the LCD and blinks the error LED
void displaySensorError(){
    if(lcdPtr != 0){
        lcdPtr->clear();
        printCentered("Sensor Error,");
        printCentered("Nothing to do.", 1);
    }
    
    for(int i = 0; i < ERROR_BLINK_COUNT; i++){
        digitalWrite(RED_PIN, HIGH);
        delay(ERROR_BLINK_DELAY_MS);
        digitalWrite(RED_PIN, LOW);
        delay(ERROR_BLINK_DELAY_MS);
    }
};

// calculateUsagePercentage function
// Calculates the usage percentage based on distance
//
// Parameters:
//   distance - Distance measured in centimeters
// Returns:
//    The usage percentage (0-100)
float calculateUsagePercentage(float distance){
    distance = min(distance, MAX_SENSOR_DISTANCE);
    return (distance / MAX_SENSOR_DISTANCE) * 100.0f;
};

// getDistance function
// Measures distance using the ultrasonic sensor
//
// Returns: 
//   Distance in microseconds if successful
//   -1 if the sensor times out or an error occurs 
long getDistance(){
    // Send a brief high pulse to trigger the sensor
    digitalWrite(TRIGGER_PIN, HIGH);
    // 10 microsecond pulse as per sensor requirements
    delayMicroseconds(10);
    // End the trigger pulse
    digitalWrite(TRIGGER_PIN, LOW);
    
    // Measure round-trip echo time
    long duration = pulseIn(ECHO_PIN, HIGH, DISTANCE_READ_TIMEOUT);
    // Return -1 on error or timeout, otherwise duration
    return (duration <= 0) ? (-1) : (duration);
};

// Initializes the LCD display (optional).
//
// This function attempts to initialize the LiquidCrystal_I2C object. 
// The program can function with or without the LCD connected, it 
// can potentially be used for debugging.
void initializeLCD(){
    // Attempt to initialize the LCD
    // Note: Uses dynamic allocation
    lcdPtr = new LiquidCrystal_I2C(0x027, 16, 2);
    lcdPtr->init();
    lcdPtr->backlight();
};

// Configures hardware pins for the project.
//
// This function sets the mode (INPUT or OUTPUT) of the pins 
// used to control the ultrasonic sensor and RGB LED.
void initializePins(){
    pinMode(TRIGGER_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(RED_PIN, OUTPUT);
    pinMode(BLUE_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
};

// setup function
// Initializes the system and peripherals 
void setup(){
    initializeLCD();
    initializePins();
};

// loop function
// Main program loop - reads distance and updates display
void loop(){
    // Get distance reading from the sensor
    long duration = getDistance();

    if(duration == -1){
        // Display an error message if the sensor failed
        displaySensorError();
        return;
    }
    
    displayUsage(duration);
};