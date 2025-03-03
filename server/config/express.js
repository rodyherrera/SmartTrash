const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');
const socketIO = require('socket.io');

const bootstrap = require('@utilities/bootstrap');
const globalErrorHandler = require('@controllers/globalErrorHandler');

const app = express();
const httpServer = http.createServer(app);
const io = socketIO(httpServer, { cors: { origin: process.env.CORS_ORIGIN } });

bootstrap.configureApp({
    app,
    suffix: '/api/v1/',
    routes: [
        'auth',
        'device',
        'deviceLog'
    ],
    middlewares: [
        cors({ origin: process.env.CORS_ORIGIN, credentials: true }),
        bodyParser.json(),
        bodyParser.urlencoded({ extended: true })
    ],
    settings: {
        deactivated: [
            'x-powered-by'
        ]
    }
});


app.use(globalErrorHandler);

module.exports = { app, httpServer, io };