#include <Wire.h>
#include <LiquidCrystal_I2C.h>

// Pin connected to the trigger output of the sensor
const unsigned short int TRIGGER_PIN = 3;
// Pin connected to the echo input of the sensor
const unsigned short int ECHO_PIN = 2;
// Timeout for distance readings (microseconds)
const unsigned short int DISTANCE_READ_TIMEOUT = 30000;
// Error LED blink count
const unsigned short int ERROR_BLINK_COUNT = 10;
// Error LED blink delay (milliseconds)
const unsigned short int ERROR_BLINK_DELAY_MS = 100;
// Maximum distance the sensor can read (cm)
const unsigned short int MAX_SENSOR_DISTANCE = 20;
// Speed of sound in centimeters per microsecond.
// This constant is used for distance calculations in sensor measurements.
const float SPEED_OF_SOUND_CM_PER_US = 0.034 / 2;

// Pins for the RGB LED module
const unsigned short int RED_PIN = 10;
const unsigned short int GREEN_PIN = 9;
const unsigned short int BLUE_PIN = 8;

// Optional LCD object - only initialize if it's connected
static LiquidCrystal_I2C *lcdPtr = 0;

// Centers text on a specified line of the LCD display
//
// Parameters:
//   text - The text string to display
//   columnIndex - The row index (0-based) where the text should be placed (default = 0)
static void printCentered(const char* text, unsigned short int columnIndex = 0){
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
static void displayUsage(unsigned long duration){
    // Calculate distance in centimeters
    unsigned short int distance = duration * SPEED_OF_SOUND_CM_PER_US;
    byte usagePercentage = calculateUsagePercentage(distance);

    if(lcdPtr != 0){
        lcdPtr->clear();
        printCentered("Usage");
        char displayStringBuffer[30];
        sprintf(displayStringBuffer, "%d%% - %d cm", usagePercentage, distance);
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
static void displaySensorError(){
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
static unsigned short int calculateUsagePercentage(unsigned short int distance){
    return min(distance, MAX_SENSOR_DISTANCE) * 100 / MAX_SENSOR_DISTANCE;  
};

// getDistance function
// Measures distance using the ultrasonic sensor
//
// Returns: 
//   Distance in microseconds if successful
//   -1 if the sensor times out or an error occurs 
static unsigned long getDistance(){
    // Send a brief high pulse to trigger the sensor
    digitalWrite(TRIGGER_PIN, HIGH);
    // 10 microsecond pulse as per sensor requirements
    delayMicroseconds(10);
    // End the trigger pulse
    digitalWrite(TRIGGER_PIN, LOW);
    
    // Measure round-trip echo time
    unsigned long duration = pulseIn(ECHO_PIN, HIGH, DISTANCE_READ_TIMEOUT);
    // Return -1 on error or timeout, otherwise duration
    return (duration <= 0) ? (-1) : (duration);
};

/**
 * Initializes the system peripherals and hardware components.
 *
 * This function performs the following:
 * - Attempts to initialize an optional LiquidCrystal_I2C LCD display.
 * - Configures the input/output modes for the hardware pins used by the ultrasonic sensor and RGB LED.
*/
void initializeSystem(){
    // Attempt to initialize the LCD
    // Note: Uses dynamic allocation
    lcdPtr = new LiquidCrystal_I2C(0x027, 16, 2);
    lcdPtr->init();
    lcdPtr->backlight();
    
    // Configures hardware pins for the project.
    pinMode(TRIGGER_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(RED_PIN, OUTPUT);
    pinMode(BLUE_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
};

// setup function
// Initializes the system and peripherals 
void setup(){
    initializeSystem();
};

// loop function
// Main program loop - reads distance and updates display
void loop(){
    // Get distance reading from the sensor
    unsigned long duration = getDistance();

    if(duration == -1){
        // Display an error message if the sensor failed
        displaySensorError();
        return;
    }
    
    displayUsage(duration);
};