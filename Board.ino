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

// Definition of bytes for printing icons on LCD.
byte SuccessIcon[8] = { B00000, B00001, B00011, B10110, B11100, B01000, B00000, B00000 };
byte CIcon[8] = { B00000, B00000, B01110, B01000, B01000, B01110, B00000, B00000 };
byte BIcon[8] = { B00000, B00000, B01000, B01000, B01110, B01110, B00000, B00000 };
byte ErrorIcon[8] = { B11101, B10001, B11101, B10000, B10001, B00000, B00000, B00000 };

// Optional LCD object - only initialize if it's connected
static LiquidCrystal_I2C *lcdPtr = 0;

/**
 * Centers and prints text on a specified line of the LCD display.
 *
 * This function calculates the appropriate position to center a given text string on the LCD and prints it.
 *
 * @param text The text string to display.
 * @param columnIndex The row index (0-based) where the text should be placed (default = 0).
*/
static void printCentered(const char* text, unsigned short int columnIndex = 0){
    unsigned short int textLength = strlen(text);
    // The integer value "16" from which the length of the text is 
    // subtracted, represents the number of characters that 
    // the screen can hold per column.
    unsigned short int position = (16 - textLength) / 2;

    // Check if text will fit on the LCD
    if(position >= 0 && lcdPtr != 0){
        lcdPtr->setCursor(position, columnIndex);
        lcdPtr->print(text);
    }
};

/**
 * Calculates and displays the usage information based on the measured distance.
 *
 * This function performs the following actions:
 * 1. Calculates the distance in centimeters based on echo duration and the speed of sound.
 * 2. Calculates the usage percentage using the calculateUsagePercentage() function.
 * 3. Updates the LCD display (if initialized) with the usage percentage and distance.
 * 4. Controls error and status LEDs based on the calculated usage percentage.
 *
 * @param duration The round-trip travel time of the ultrasonic pulse in microseconds.
*/
static void displayUsage(unsigned long duration){
    // Calculate distance in centimeters
    unsigned short int distance = duration * SPEED_OF_SOUND_CM_PER_US;
    byte usagePercentage = calculateUsagePercentage(distance);

    if(lcdPtr != 0){
        lcdPtr->clear();
        lcdPtr->setCursor(0, 0);
        lcdPtr->write(2);
        lcdPtr->setCursor(1, 0);
        lcdPtr->write(3);
        printCentered("Usage");
        lcdPtr->setCursor(15, 0);
        lcdPtr->write((distance < MAX_SENSOR_DISTANCE) ? (0) : (1));
        char displayStringBuffer[30];
        sprintf(displayStringBuffer, "%d%% - %d cm", usagePercentage, distance);
        printCentered(displayStringBuffer, 1);
    }

    const bool isPercentageCorrect = usagePercentage < 100.0f;
    // Light error/OK LEDs appropriately
    digitalWrite(RED_PIN, !isPercentageCorrect);
    digitalWrite(BLUE_PIN, isPercentageCorrect);

    delay(500);
    digitalWrite(BLUE_PIN, LOW);
};

/**
 * Displays a sensor error message and blinks the error LED. 
 *
 * This function does the following:
 * 1. Checks if the LCD is initialized, and if so, displays a "Sensor Error"  message on the display.
 * 2. Blinks the error LED (presumably a red LED) a specified number of times with a defined delay.
*/
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

/**
 * Calculates the usage percentage based on distance.
 * 
 * This function takes a distance measurement and determines the percentage of the maximum sensor range that distance represents.
 * 
 * @param distance The distance measured in centimeters.
 * @return The usage percentage (0-100). 
*/
static unsigned short int calculateUsagePercentage(unsigned short int distance){
    return min(distance, MAX_SENSOR_DISTANCE) * 100 / MAX_SENSOR_DISTANCE;  
};

/**
 * Measures the distance using an ultrasonic sensor. 
 * 
 * This function performs the following steps:
 * 1. Triggers the ultrasonic sensor by sending a brief high pulse on the TRIGGER_PIN.
 * 2. Measures the round-trip time of the echo pulse on the ECHO_PIN.
 * 3. Calculates the distance based on the measured echo time and the speed of sound.
 *
 * @return The distance in microseconds, or -1 if an error or timeout occurs. 
*/
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
    lcdPtr->createChar(0, SuccessIcon);
    lcdPtr->createChar(1, ErrorIcon);
    lcdPtr->createChar(2, CIcon);
    lcdPtr->createChar(3, BIcon);

    // Configures hardware pins for the project.
    pinMode(TRIGGER_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(RED_PIN, OUTPUT);
    pinMode(BLUE_PIN, OUTPUT);
    pinMode(GREEN_PIN, OUTPUT);
};

/**
 * The setup function runs once at the start of the program.
 * 
 * This function initializes the system by calling the initializeSystem() function, 
 * which configures the necessary hardware and peripherals.
*/
void setup(){
    initializeSystem();
};

/**
 * The main program loop, executed repeatedly after setup().
 * 
 * This function performs the following actions:
 * 1. Reads the distance from the ultrasonic sensor using the getDistance() function.
 * 2. Handles potential sensor errors by calling displaySensorError() if the distance reading is invalid.
 * 3. Updates the display with the measured distance and usage information using the displayUsage() function.
*/
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