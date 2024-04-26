const express = require('express');
const router = express.Router();
const authenticationMiddleware = require('@middlewares/authentication');
const deviceController = require('@controllers/device');

router.use(authenticationMiddleware.protect);

router.get('/me/', deviceController.getMyDevices)
router.get('/:id/analytics/', deviceController.getDeviceAnalytics);
router.post('/', deviceController.createDevice);

router.use(authenticationMiddleware.restrictTo('admin'));

router.route('/:id')
    .get(deviceController.getDevice)
    .patch(deviceController.updateDevice)
    .delete(deviceController.deleteDevice);

router.get('/', deviceController.getDevices);

module.exports = router;