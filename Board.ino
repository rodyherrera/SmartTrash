#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define TRIGGER_PIN 12
#define ECHO_PIN 11
#define ERROR_LED_PIN 7
#define BLUE_LED_PIN 6

#define DISTANCE_READ_TIMEOUT 30000
#define ERROR_BLINK_COUNT 10
#define ERROR_BLINK_DELAY_MS 100
#define MAX_SENSOR_DISTANCE 20

LiquidCrystal_I2C lcd(0x027, 16, 2);

void printCentered(const char* text, unsigned short int columnIndex = 0){
    unsigned short int textLength = strlen(text);
    unsigned short int position = (16 - textLength) / 2;
    // Check if text will fit on the LCD
    if(position >= 0){
        lcd.setCursor(position, columnIndex);
        lcd.print(text);
    }
};

void displayUsage(long duration){
    float distance = duration * 0.034 / 2;
    lcd.clear();
    printCentered("Usage");

    float usagePercentage = calculateUsagePercentage(distance);
    char displayStringBuffer[30];
    sprintf(displayStringBuffer, "%d%% - %d cm", (int)usagePercentage, (int)distance);
    printCentered(displayStringBuffer, 1);

    const bool isPercentageCorrect = usagePercentage < 100.0f;
    digitalWrite(ERROR_LED_PIN, !isPercentageCorrect);
    digitalWrite(BLUE_LED_PIN, isPercentageCorrect);
    delay(500);
    digitalWrite(BLUE_LED_PIN, LOW);
};

void displaySensorError(){
    lcd.clear();
    printCentered("Sensor Error,");
    printCentered("Nothing to do.", 1);
    
    for(int i = 0; i < ERROR_BLINK_COUNT; i++){
        digitalWrite(ERROR_LED_PIN, HIGH);
        delay(ERROR_BLINK_DELAY_MS);
        digitalWrite(ERROR_LED_PIN, LOW);
        delay(ERROR_BLINK_DELAY_MS);
    }
};

float calculateUsagePercentage(float distance){
    distance = min(distance, MAX_SENSOR_DISTANCE);
    return (distance / MAX_SENSOR_DISTANCE) * 100.0f;
};

long getDistance(){
    digitalWrite(TRIGGER_PIN, HIGH);
    delayMicroseconds(10);
    digitalWrite(TRIGGER_PIN, LOW);
    
    long duration = pulseIn(ECHO_PIN, HIGH, DISTANCE_READ_TIMEOUT);
    return (duration <= 0) ? (-1) : (duration);
};

void setup(){
    lcd.init();
    lcd.backlight();
    
    Serial.begin(9600);

    pinMode(TRIGGER_PIN, OUTPUT);
    pinMode(ECHO_PIN, INPUT);
    pinMode(ERROR_LED_PIN, OUTPUT);
    pinMode(BLUE_LED_PIN, OUTPUT);
};

void loop(){
    long duration = getDistance();

    if(duration == -1){
        displaySensorError();
    }else{
        displayUsage(duration);
    }
};