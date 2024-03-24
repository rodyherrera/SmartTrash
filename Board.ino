#include <Wire.h>
#include <LiquidCrystal_I2C.h>

#define TRIGGER_PIN 12
#define ECHO_PIN 11
#define ERROR_LED_PIN 7
#define BLUE_LED_PIN 6
#define DISTANCE_READ_TIMEOUT 30000

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
    displayDistance(duration);
  }else{
    displaySensorError();
  }
}

// Calculates distance based on sensor readings
long getDistance(){
  digitalWrite(TRIGGER_PIN, HIGH);
  delayMicroseconds(10);
  digitalWrite(TRIGGER_PIN, LOW);
  long duration = pulseIn(ECHO_PIN, HIGH, DISTANCE_READ_TIMEOUT);
  return (duration == 0) ? -1 : duration;
}

void print(String text, unsigned short int columnIndex = 0){
  lcd.setCursor((16 - text.length()) / 2, columnIndex);
  lcd.print(text);
};

// Displays distance on the LCD
void displayDistance(long duration){
  float distance = duration * 0.034 / 2;
  lcd.clear();
  String distanceTitle = "Distance";
  print(distanceTitle);
  char distanceValueBuffer[10];
  dtostrf(distance, 6, 2, distanceValueBuffer);
  String distanceValueStr = String(distanceValueBuffer) + " cm";
  print(distanceValueStr, 1);
  // Brief indicator LED flash
  digitalWrite(ERROR_LED_PIN, LOW);
  digitalWrite(BLUE_LED_PIN, HIGH);
  delay(500);
  digitalWrite(BLUE_LED_PIN, LOW);
}

// Displays a sensor error message on the LCD
void displaySensorError(){
  lcd.clear();
  lcd.setCursor(0, 0);
  lcd.print("Sensor Error!");
  lcd.setCursor(0, 1);
  lcd.print("Check connection.");
  // TODO: Is this the best way of do it?
  for(int i = 0; i < 10; i++){
    digitalWrite(ERROR_LED_PIN, HIGH);
    delay(100);
    digitalWrite(ERROR_LED_PIN, LOW);
    delay(100);
  }
}