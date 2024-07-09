const HandlerFactory = require('@controllers/handlerFactory');
const DeviceLog = require('@models/deviceLog');

const DeviceLogFactory = new HandlerFactory({
    model: DeviceLog,
    fields: [
        'stduid',
        'distance',
        'usagePercentage'
    ]
});

exports.getDeviceLog = DeviceLogFactory.getAll();