const mongoose = require('mongoose');
const { redisClient } = require('@utilities/redisClient');

const DeviceSchema = new mongoose.Schema({
    name: {
        type: String,
        minlength: [4, 'Device::Name::MinLength'],
        maxlength: [16, 'Device::Name::MaxLength'],
        required: [true, 'Device::Name::Required'],
        trim: true
    },
    users: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: [true, 'Device::User::Required']
    }],
    height: {
        type: Number,
        default: 0
    },
    stduid: {
        type: String,
        maxlength: [32, 'Device::STDUID::MaxLength'],
        required: [true, 'Device::STDUID::Required'],
        unique: true,
        trim: true
    },
    createdAt: {
        type: Date,
        default: Date.now()
    }
});
DeviceSchema.index({ name: 'text' });
DeviceSchema.index({ _id: 1, users: 1 });
DeviceSchema.index({ stduid: 1 }, { unique: true }); 

DeviceSchema.post('save', async function(doc){
    await redisClient.del(`mqttc-device:${doc.stduid}`);
});

DeviceSchema.post('remove', async function(doc){
    await redisClient.del(`mqttc-device:${doc.stduid}`);
});

// TODO: Associate device with log partition!
// Is id needed as parameter?
DeviceSchema.methods.generateAnalytics = async function(stduid){
    const today = new Date();
    const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    const lastWeekEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    const filter = {
        name: { 
            $gte: lastWeekStart.toISOString().substring(0, 10),
            $lte: lastWeekEnd.toISOString().substring(0, 10)
        },
        stduid
    };
    const partitions = await mongoose.model('DeviceLogPartition')
        .find(filter)
        .select('_id name logs')
        .populate({
            path: 'logs',
            select: 'usagePercentage'
        })
        .lean();
    let totalUsageSum = 0;
    let totalLogsCount = 0;
    partitions.forEach(({ logs }) => {
        if(!logs.length) return;
        const totalUsagePercentage = logs.reduce((acc, log) => acc + log.usagePercentage, 0);
        totalUsageSum += totalUsagePercentage;
        totalLogsCount += logs.length;
    });
    const globalAverageUsagePercentage = (totalLogsCount > 0) ? (totalUsageSum / totalLogsCount) : (0);
    console.log(globalAverageUsagePercentage);
    return partitions;
};

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;