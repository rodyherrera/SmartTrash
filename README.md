# The IoT-based solution for your recycling points and garbage containers. 
With SmartTrash, you can monitor the trash points of your entire infrastructure whenever and wherever you want. You can adjust when you want notifications to arrive, 90% of usage? Maybe 80% is better. You can add as many emails as you want to notify about the container's usability as you have adjusted and, see in real time how the updates of all your containers are processed and saved in the system.

The device in relation to when you want it to notify you, for example when the device is over 80%, if it is not cleaned in the next 10 minutes, it will send you a notification again, and so on until the usage percentage drops below 80%. Personally, this approach is cool because I use this product every day and it forces me to clean it if I don't want to be filled with notifications every 10 minutes.

We use Redis to guarantee performance, since there can be thousands of hundreds of containers simultaneously sending data to the server without causing performance problems on this. The sensor readings that are sent to the back-end are sent to Redis where there is a queue that contains them, where they are all periodically processed and stored with a bulkWrite in MongoDB. This approach prevents all those hundreds of thousands of containers sending data to the server from translating into operations that must be done for each one in the database and at the instruction level on the server. It is processed by queue and using batches.

The source code is divided into 3 parts: The SmartTrash Cloud Platform, NodeMCU Local Control Panel and the front-end application.  The NodeMCU must be flashed with its code that is available within the "esp8266" directory. A user interface has been developed with React.js to connect the device to the internet, to the cloud, and also to change the access point configuration (SSID/Password). 

Inside the "server/" directory is the software that allows you to build the back-end of the platform, just an "npm run start" is enough, but you must first configure the environment variables, where it must be specified, among other things: Redis, MongoDB, MQTT and SMTP Server. Of course, the "client/" directory that contains the React application, that is, the front-end of the platform, which allows you to interact with the back-end, which in turn interacts with the NodeMCU. Within the "client/" directory, there is also a .env file, where you only have to indicate the address of the back-end server.

## What components do I need?
In order to guarantee the operation of the software as such, you need a [`NodeMCU` (this was tested using a NodeMCU LoLin v3)](https://www.amazon.com/YEJMKJ-Wireless-Development-Compatible-Micropython/dp/B0CDRM3R1Y/ref=sr_1_1_sspa?dib=eyJ2IjoiMSJ9.2nPu0IT60pTmTclOvRx6tsTTFjgVTHortAJSe4n92rQKkaEw4rsgM_puB86qEbNFNfh4tl3KiDDk_G9Db5GB6zepbySxae_RoKi7UDAKtNes5iBNVcdNnELtzN8bkA3yFCqSXPo_MyHNdyukGb6MjE7reybXpcE7RnxNZineBrDQi3xCBph9ggXd5yP2OpfbZXyZGqYSfu8wSf6Z8IfJdgoABsXhx5B-nKjzRhl4jzg.K71SRO5kmPMxi42bimw-8J-1JZfvR9qQHWnTwU2YZHc&dib_tag=se&keywords=nodemcu+esp8266+v3&qid=1720638927&sr=8-1-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&psc=1) and an [`HC-SR04`](https://www.amazon.com/WWZMDiB-HC-SR04-Ultrasonic-Distance-Measuring/dp/B0B1MJJLJP/ref=sr_1_2_sspa?crid=3G5EJW4Y9MMP&dib=eyJ2IjoiMSJ9.E2SIkElJhtFWCJCHL5Q6Yys8UWphh18sr7FUgRDIlqfu_m6KrWJRQJDiJfvtDIf1Oomcm-hTNaNeL6xl2IlDheY0zgdqWoz_8tno80-pMt2fsz86Pw7PPZS4tdx7wmN14bQrUSI4ZiLteZItjrBfmsWP8PBfEdNmyTwbnq3irofr6oonZ47dREobtB0NoIJX8rt2dS7SVzuJt9KrSCcR0Ji8rQ4H84_83dbIyUmHt0A.SsD5-G0dHaqc_YVDeo-8M6CWhkWQbLr3xWb07Z_s1IM&dib_tag=se&keywords=hc-sr04&qid=1720638987&sprefix=hc-sr%2Caps%2C351&sr=8-2-spons&sp_csd=d2lkZ2V0TmFtZT1zcF9hdGY&th=1) ultrasound sensor. 

`NOTE`: You must configure what pin you locate both the `trigger and the echo of the HC-SR04 sensor` of the NodeMCU in `esp8266/src/hardware/hardware.cpp`.

## Installation
After cloning the repository, you will need to install the modules using "npm i" for both the back-end and the front-end.

```sh
git clone https://github.com/rodyherrera/SmartTrash/
cd SmartTrash
ls 
# - client/ (front-end app)
# - esp8266/ (NodeMCU Software)
# - server/ (back-end app)
```
You must `flash the NodeMCU` with the software found within the `esp8266/` directory, and as such for compilation in your Arduino IDE you must have certain libraries: [ArduinoJson.h](https://github.com/bblanchon/ArduinoJson), [ESP8266WiFi.h](https://arduino-esp8266.readthedocs.io/en/latest/esp8266wifi/readme.html), [ESPAsyncTCP.h](https://github.com/me-no-dev/ESPAsyncTCP), [ESPAsyncWebServer.h](https://github.com/me-no-dev/ESPAsyncWebServer), [LittleFS.h](https://github.com/littlefs-project/littlefs), [WiFiClient.h](https://github.com/esp8266/Arduino/blob/master/libraries/ESP8266WiFi/src/WiFiClient.h), [PubSubClient.h](https://github.com/knolleary/pubsubclient)

### Loading the frontend application within the NodeMCU FS
Inside the `esp8266/` directory there is another directory called `data/`, which contains the front-end application of the control panel (React application found in "esp8266/admin"), the only thing you have to do is upload it to NodeMCU file system, and for this we need `NodeMCU LittleFS Filesystem Uploader` in `Arduino 1.8`.

`NOTE`: You should be careful with that, the NodeMCU LittleFS Filesystem Uploader plugin does not work with modern versions of the Arduino IDE, only on Arduino 1.8. So if you do not have that version installed, you will have to download it to do this step.

I will leave you a `tutorial` that I found in a Github repository, it is brief, just follow the instructions. [View Tutorial](https://github.com/esp8266/arduino-esp8266fs-plugin)

### After flashing the NodeMCU
We have the last steps left, and that is that you must configure the environment variables that are found in both the front-end and the back-end.

Next, I will provide you with the `.env.example` found within `server/`, you must create a new file called `.env` with the configuration that you establish for each variable.
```env 
# NODE_ENV: Defines the server execution environment. 
NODE_ENV = development

# SECRET_KEY: Secret key used for encrypting 
# sensitive data. It's crucial for ensuring application security.
SECRET_KEY = your-secret-key

# MQTT & REDIS CONFIG
MQTT_SERVER = mqtt.rodyherrera.com
MQTT_SERVER_PORT = 1883
MQTT_USERNAME = your-mqtt-username
MQTT_PASSWORD = your-mqtt-password

REDIS_HOST = rodyherrera.com
REDIS_PASSWORD = your-redis-password
REDIS_PORT = 6379

CLIENT_HOST = http://0.0.0.0:4000

# SERVER_PORT: The port on which the server 
# is listening for incoming requests.
SERVER_PORT = 8000

# SERVER_HOSTNAME: The hostname of the 
# server where the application is running.
SERVER_HOSTNAME = 0.0.0.0

# SMTP: For sending notifications via email.
SMTP_HOST = mail.rodyherrera.com
SMTP_PORT = 465
SMTP_AUTH_USER = no-reply@rodyherrera.com
SMTP_AUTH_PASSWORD = your-smtp-password

# JWT_EXPIRATION_DAYS: Specifies the validity duration 
# of JWT tokens issued for user authentication.
JWT_EXPIRATION_DAYS = 7d

# CORS_ORIGIN: Defines allowed origins for 
# cross-origin resource sharing (CORS) requests. In 
# this case, it allows from any origin.
CORS_ORIGIN = *

# PRODUCTION_DATABASE: Specifies the production 
# database the application will connect to.
PRODUCTION_DATABASE = smarttrash@production

# DEVELOPMENT_DATABASE: Specifies the development 
# database the application will connect to.
DEVELOPMENT_DATABASE = smarttrash@development

# MONGO_URI: MongoDB connection URI 
# used by the application.
MONGO_URI = mongodb://user:password@hostname:port
```

In the same way, I will present you the `client/.env.example`, where you must also create your `.env` within the `client/` directory according to the configuration you establish:
```env
# VITE_SERVER: Address where the 
# SmartTrash backend is deployed.
VITE_SERVER = http://localhost:8000

# VITE_API_SUFFIX: Suffix to make API 
# calls, you should not change /api/v1.
VITE_API_SUFFIX = /api/v1
```

## Connecting the NodeMCU to the internet
Once you have flashed the software found within `esp8266` on the device and it is running, you should be able to see in the list of available WiFi networks a network called `SmartTrash`, you must connect to it using the default password `toortoor`.

Once you have connected, you must open your preferred browser and go to `192.168.1.1`, where you can access the `NodeMCU Control Panel` to connect it to the Internet. The device will connect automatically when it detects the network when turned on. Otherwise you will have to configure it again.

## How does the NodeMCU connect to the cloud?
Once you have flashed the software inside your NodeMCU, you will be able to enter the web server that starts once it is turned on, with the address at "192.168.1.1". There, you will have among the options available, one called `Connect to the Cloud`, where if you click on it it will take you to another page where you will have a unique code, which allows you to identify the device to others on the network.

`And what should I do with this code?` Well, now, you must copy this code and go to the front-end of the platform, where after having created an account and logging in, you will have an option in the menu called `Link device to the Cloud`, there you can place this code that you have previously copied to be able to link the device with your account.

### Device Calibration
After you pair the device with your SmartTrash Cloud ID, you will be redirected to now calibrate your device. Well, the metrics that are generated in relation to the use of your container are in relation to the height it has, and to know its height it is necessary that we calibrate it. We assume that the sensor is located at the top of the container, and that it is pointing downwards, which represents the bottom of the container when empty. This measured distance will be displayed on the screen, and you must confirm if it is the correct height of the container. container. You can calibrate as many times as you want.

The background to all this is that, once you connect the NodeMCU to the internet, it will automatically start sending data from the HC-SR04 sensor to the MQTT server (which you must configure in `/esp8266/src/config/config.cpp`). The back-end will be listening for all MQTT requests, but will reject your device if it is not linked to any account. Once you link your account, requests will be accepted to be processed and stored in the database.

The unique code (also called SmartTrash Unique ID (STUID)) is generated through the MAC address of the device. This way it is guaranteed to be unique among its peers.

## Behind the user interface
The technologies used to be able to mount this software in production and on a real scale of hundreds of thousands of devices are mainly: Redis, MongoDB and MQTT. Everything is written in JavaScript using Node.js. Express.js is used as a web server and React.js for the development of user interfaces.

You must have a MongoDB database and a Redis instance as well as an MQTT instance to be able to build the back-end, in addition to configuring the MQTT server in the NodeMCU `esp8266/src/config.cpp`. Maybe it will be useful in future versions to dockerize this.


## License
MIT
**Free Software, Hell Yeah!**

