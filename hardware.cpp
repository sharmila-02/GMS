#include <ESP8266WiFi.h>
#include <FirebaseArduino.h>
#include <Arduino.h>
#include "HX711.h"
#define FIREBASE_HOST "gmssystem-4e138-default-rtdb.firebaseio.com"
#define FIREBASE_AUTH "1NfMzYrhN9G8CBKdEmlSBYWV3hYu15XdBrshmukL"
#define WIFI_SSID "V9.9"
#define WIFI_PASSWORD "182918gg183611"
#define CALIBRATION_FACTOR 251.723
#define BIN_LEVEL 0.19
#define BIN_DENSITY 500.00
#define PI 3.141592
#define S 0.19
const int trigPin = D2;
const int echoPin = D1;
const int LOADCELL_DOUT_PIN = D6;
const int LOADCELL_SCK_PIN = D7;
long duration;
float distance;
float fill_percentage;
HX711 scale;
float weight;
void setup() {
pinMode(trigPin, OUTPUT);
// Sets the trigPin as an Output
pinMode(echoPin, INPUT);
// Sets the echoPin as an Input
Serial.begin(115200); // Starts the serial communication
WiFi.begin(WIFI_SSID, WIFI_PASSWORD);
Serial.print("Connecting to ");
Serial.print(WIFI_SSID);
while (WiFi.status() != WL_CONNECTED) {
Serial.print(".");
delay(500);
}
Serial.println();
Serial.print("Connected");
Serial.print("IP Address: ");
//prints local IP address
Serial.println(WiFi.localIP());
Firebase.begin(FIREBASE_HOST, FIREBASE_AUTH);
scale.begin(LOADCELL_DOUT_PIN, LOADCELL_SCK_PIN);
scale.set_scale(251.732);
with known weights
scale.tare();
}
void loop() {
// this value is obtained by calibrating the scale
digitalWrite(trigPin, LOW);
delayMicroseconds(2);
digitalWrite(trigPin, HIGH);
delayMicroseconds(10);
digitalWrite(trigPin, LOW);
duration = pulseIn(echoPin, HIGH);
distance= duration*0.034/2;
Serial.print("Distance: ");
Serial.println(distance);
Serial.print(" ");
Serial.print("Average weight: ");
Serial.println(scale.get_units(10),5);
weight = scale.get_units(10);
distance/=100.00;
weight/=1000.00;
if(distance>BIN_LEVEL){
fill_percentage = (weight/(BIN_DENSITY*S*S*BIN_LEVEL))*100.0;
}
else{
fill_percentage = ((BIN_LEVEL-distance)/BIN_LEVEL)*100;
}
weight=weight*1000.00;
// fill_percentage = distance; [Used this line of code for trial (not needed in original implementation)]
Firebase.setFloat("/Bins/Bin1/Fill",(int)fill_percentage);
Firebase.setFloat("/Bins/Bin1/Weight",weight);
Firebase.setFloat("/Bins/Bin2/Fill",(int)(fill_percentage*0.86));
Firebase.setFloat("/Bins/Bin2/Weight",weight*0.86);
Firebase.setFloat("/Bins/Bin3/Fill",(int)(fill_percentage*0.9));
Firebase.setFloat("/Bins/Bin3/Weight",weight*0.9);
Firebase.setFloat("/Bins/Bin4/Fill",(int)(fill_percentage*0.39));
Firebase.setFloat("/Bins/Bin4/Weight",weight*0.39);
Firebase.setFloat("/Bins/Bin5/Fill",(int)(fill_percentage*0.73));
Firebase.setFloat("/Bins/Bin5/Weight",weight*0.73);
Firebase.setFloat("/Bins/Bin6/Fill",(int)(fill_percentage*0.69));
Firebase.setFloat("/Bins/Bin6/Weight",weight*0.69);
Firebase.setFloat("/Bins/Bin7/Fill",(int)(fill_percentage*0.79));
Firebase.setFloat("/Bins/Bin7/Weight",weight*0.79);
Firebase.setFloat("/Bins/Bin8/Fill",(int)(fill_percentage*0.65));
Firebase.setFloat("/Bins/Bin8/Weight",weight*0.65);
Firebase.setFloat("/Bins/Bin9/Fill",(int)(fill_percentage*0.55));
Firebase.setFloat("/Bins/Bin9/Weight",weight*0.55);
Firebase.setFloat("/Bins/Bin10/Fill",(int)(fill_percentage*0.45));
Firebase.setFloat("/Bins/Bin10/Weight",weight*0.45);
if (Firebase.failed()){
Serial.print("pushing /logs failed:");
Serial.println(Firebase.error());
return;
}
delay(100);}
