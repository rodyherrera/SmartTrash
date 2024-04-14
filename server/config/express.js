const express = require('express');
const cors = require('cors');
const http = require('http');
const bodyParser = require('body-parser');

const bootstrap = require('@utilities/bootstrap');
const globalErrorHandler = require('@controllers/globalErrorHandler');

const app = express();
const httpServer = http.createServer(app);

bootstrap.configureApp({
    app,
    suffix: '/api/v1/',
    routes: [
        'auth',
        'device'
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

module.exports = { app, httpServer };