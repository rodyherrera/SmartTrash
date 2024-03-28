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
        'auth'
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

app.all('*', (req, res) => {
    if(req.path.startsWith('/api/v1/')){
        return res.status(404).json({
            status: 'error',
            data: {
                message: 'INVALID_API_REQUEST',
                url: req.originalUrl
            }
        })
    }
    res.redirect(process.env.CLIENT_HOST);
});

app.use(globalErrorHandler);

module.exports = { app, httpServer };