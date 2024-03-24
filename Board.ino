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

void setup(){
  lcd.init();
  lcd.backlight();
  lcd.setCursor(0, 0);
  lcd.print("Initializing...");
  delay(1000);
  Serial.begin(9600);
  pinMode(TRIGGER_PIN, OUTPUT);
  pinMode(ECHO_PIN, INPUT);
  pinMode(ERROR_LED_PIN, OUTPUT);
  pinMode(BLUE_LED_PIN, OUTPUT);
  // Sensor stabilization
  delay(500);
}

void loop(){
  long duration = getDistance();
  if(duration != -1){
    displayUsage(duration);
  }else{
    displaySensorError();
  }
}

// Usage percent from MAX_SENSOR_DISTANCE
float calculateUsagePercentage(float distance){
  if(distance > MAX_SENSOR_DISTANCE) return 100.0f;
  return (distance / MAX_SENSOR_DISTANCE) * 100.0f;
}

// Calculates distance based on sensor readings
long getDistance(){
  digitalWrite(TRIGGER_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGGER_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, DISTANCE_READ_TIMEOUT);
  return (duration == 0) ? -1 : duration;
}

void printCentered(const char* text, unsigned short int columnIndex = 0){
  lcd.setCursor((16 - strlen(text)) / 2, columnIndex);
  lcd.print(text);
};

// Displays usage on the LCD
void displayUsage(long duration){
  float distance = duration * 0.034 / 2;
  lcd.clear();

  printCentered("Usage"); 
  float usagePercentage = calculateUsagePercentage(distance);
  char displayString[30];
  sprintf(displayString, "%d%% - %d cm", (int)usagePercentage, (int)distance);
  printCentered(displayString, 1); 

  digitalWrite(ERROR_LED_PIN, LOW); 
  digitalWrite(BLUE_LED_PIN, HIGH);
  delay(500);
  digitalWrite(BLUE_LED_PIN, LOW);
}

// Displays a sensor error message on the LCD
void displaySensorError(){
  lcd.clear();
  printCentered("Sensor Error!");
  printCentered("Check connection.", 1);

  for(int i = 0; i < ERROR_BLINK_COUNT; i++){
    digitalWrite(ERROR_LED_PIN, HIGH);
    delay(ERROR_BLINK_DELAY_MS);
    digitalWrite(ERROR_LED_PIN, LOW);
    delay(ERROR_BLINK_DELAY_MS);
  }
}