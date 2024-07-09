const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('@middlewares/authentication');
const deviceLogController = require('@controllers/deviceLog');

router.use(authenticationMiddleware.protect);
router.get('/me/', deviceLogController.getDeviceLog)

module.exports = router;