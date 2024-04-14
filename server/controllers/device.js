const HandlerFactory = require('@controllers/handlerFactory');
const Device = require('@models/device');
const RuntimeError = require('@utilities/runtimeError');
const mqttClient = require('@utilities/mqttConnector');
const { catchAsync } = require('@utilities/runtime');

const DeviceFactory = new HandlerFactory({
    model: Device,
    fields: [
        'name',
        'user',
        'stduid'
    ]
});

exports.getDevices = DeviceFactory.getAll();
exports.getDevice = DeviceFactory.getOne();
exports.updateDevice = DeviceFactory.updateOne();
exports.deleteDevice = DeviceFactory.deleteOne();

exports.createDevice = catchAsync(async (req, res, next) => {
    const { stduid, name, user } = req.body;
    if(!stduid || !name || !user){
        return next(new RuntimeError('Device::InvalidCreationParams', 400));
    }
    const storedDevice = await Device.findOne({ stduid });
    if(storedDevice){
        console.log(storedDevice);
        if(storedDevice.users.includes(user)){
            return next(new RuntimeError('Device::UserAlreadyAssociated', 400));
        }
        storedDevice.users.push(user);
        await storedDevice.save();
        res.status(200).json({ status: 'success', data: storedDevice });
        return;
    }
    const hasRecentActivity = await mqttClient.checkTopicActivity(stduid);
    if(!hasRecentActivity){
        return next(new RuntimeError('Device::NoRecentActivity'));
    }
    const device = await Device.create({ name, stduid, users: [ user ] });
    res.status(200).json({ status: 'success', data: device });
});