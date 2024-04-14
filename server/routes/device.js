const express = require('express');
const router = express.Router();
const authMiddleware = require('@middlewares/authentication');
const deviceController = require('@controllers/device');

router.use(authMiddleware.protect);

router.post('/', deviceController.createDevice);

// router.use(authMiddleware.restrictTo('admin'));

router.route('/:id')
    .get(deviceController.getDevice)
    .patch(deviceController.updateDevice)
    .delete(deviceController.deleteDevice);

router.get('/', deviceController.getDevices);

module.exports = router;