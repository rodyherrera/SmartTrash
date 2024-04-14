const HandlerFactory = require('@controllers/handlerFactory');
const Device = require('@models/device');
const RuntimeError = require('@utilities/runtimeError');
const mqttClient = require('@utilities/mqttConnector');
const { catchAsync } = require('@utilities/runtime');

/**
 * Factory class for creating CRUD (Create, Read, Update, Delete)
 * controllers for the Device model.
 *
 * @class DeviceFactory
*/
const DeviceFactory = new HandlerFactory({
    model: Device,
    fields: [
        'name',
        'user',
        'stduid'
    ]
});

/**
 * Gets all devices.
 * 
 * @function
 * @returns {Object} Express response with the found devices
*/
exports.getDevices = DeviceFactory.getAll();

/**
 * Gets a device by its ID.
 * 
 * @function
 * @returns {Object} Express response with the found device
*/
exports.getDevice = DeviceFactory.getOne();

/**
 * Updates a device by its ID.
 * 
 * @function
 * @returns {Object} Express response with the updated device
*/
exports.updateDevice = DeviceFactory.updateOne();

/**
 * Deletes a device by its ID.
 * 
 * @function
 * @returns {Object} Express response with a confirmation message 
*/
exports.deleteDevice = DeviceFactory.deleteOne();

/**
 * Creates a new device.
 * 
 * @function 
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 * @param {Function} next - Express 'next' function for error handling
 * @returns {Object} Express response with the created device
*/
exports.createDevice = catchAsync(async (req, res, next) => {
    const { stduid, name, user } = req.body;
    if(!stduid || !name || !user){
        return next(new RuntimeError('Device::InvalidCreationParams', 400));
    }
    // Check for Existing Device: Search for a device with the provided stduid.
    const storedDevice = await Device.findOne({ stduid });
    if(storedDevice){
        // Check for Duplicate User: If a device is found, verify if the user is already associated with it.
        if(storedDevice.users.includes(user)){
            return next(new RuntimeError('Device::UserAlreadyAssociated', 400));
        }
        // Update Existing Device: Add the user to the existing device and save the changes.
        storedDevice.users.push(user);
        await storedDevice.save();
        res.status(200).json({ status: 'success', data: storedDevice });
        return;
    }
    // Check Device Activity: Verify if the device has recent activity (using MQTT).
    const hasRecentActivity = await mqttClient.checkTopicActivity(stduid);
    if(!hasRecentActivity){
        return next(new RuntimeError('Device::NoRecentActivity'));
    }
    await mqttClient.client.subscribeAsync(stduid);
    const device = await Device.create({ name, stduid, users: [ user ] });
    res.status(200).json({ status: 'success', data: device });
});