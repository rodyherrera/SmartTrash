const HandlerFactory = require('@controllers/handlerFactory');
const Device = require('@models/device');
const DeviceLog = require('@models/deviceLog');
const DeviceLogPartition = require('@models/deviceLogPartition');
const RuntimeError = require('@utilities/runtimeError');
const mqttClient = require('@utilities/mqttClient');
const User = require('@models/user');
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
        'stduid',
        'notificationPercentages',
        'notificationsSent',
        'notificationEmails',
        'height'
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
        await User.findByIdAndUpdate(user, { $push: { devices: storedDevice._id } });
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
    await User.findByIdAndUpdate(user, { $push: { devices: device._id } });
    res.status(200).json({ status: 'success', data: device });
});

// TODO: DELETE THIS CONTROLLER AND USE HANDLERFACTORY!!!
exports.getMyDevices = catchAsync(async (req, res) => {
    const devices = await Device.find({ users: req.user._id }).select('-logs -__v').lean();
    res.status(200).json({ status: 'success', data: devices });
});

exports.getDeviceAnalytics = catchAsync(async (req, res) => {
    const { id } = req.params;
    const device = await Device.findById(id).select('stduid');
    if(req.query?.type === 'countDeviceLogs'){
        const { stduid } = device;
        const logs = await DeviceLog.countDocuments({ stduid });
        const logsPartition = await DeviceLogPartition.countDocuments({ stduid });
        const data = { logs, logsPartition };
        res.status(200).json({ status: 'success', data });
        return;
    }
    const usage = await device.generateAnalytics(device.stduid);
    res.status(200).json({
        status: 'success',
        data: usage
    });
});