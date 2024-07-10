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
    notificationsSent: {
        type: Number,
        default: 0,
    },
    notificationPercentages: [{
        type: Number,
        max: 100,
        min: 0
    }],
    notificationEmails: [{
        email: {
            type: String,
            match: [/.+@.+\..+/, 'Device::NotificationEmail::InvalidFormat'],
            required: false
        },
        fullname: {
            type: String,
            required: false
        }
    }],
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

DeviceSchema.pre('save', async function(next){
    if(!this.isNew) next();
    // If the device registration is new, there will only be one user 
    // in the "users" property, we add this by default to the email 
    // list where alerts will be sent.
    const user = await mongoose.model('User').findById(this.users[0]).select('email fullname');
    if(user && user.email && user.fullname){
        const { email, fullname } = user;
        this.notificationEmails.push({ email, fullname });
    }
    next();
});

DeviceSchema.post(['findOneAndUpdate', 'save', 'remove'], async function(doc){
    await redisClient.del(`mqttc-device:${doc.stduid}`);
});

const getAverageUsagePercentage = (partitions, startDate, endDate) => {
    const usageSum = partitions.reduce((acc, partition) => {
        const totalUsagePercentage = partition.logs.reduce((innerAcc, log) => {
            const logDate = new Date(log.createdAt);
            if(logDate >= startDate && logDate <= endDate){
                return innerAcc + log.usagePercentage;
            }
            return innerAcc;
        }, 0);
        return acc + totalUsagePercentage;
    }, 0);

    const logsCount = partitions.reduce((acc, partition) => {
        const count = partition.logs.reduce((innerAcc, log) => {
            const logDate = new Date(log.createdAt);
            if(logDate >= startDate && logDate <= endDate){
                return innerAcc + 1;
            }
            return innerAcc;
        }, 0);
        return acc + count;
    }, 0);

    return (logsCount > 0) ? (usageSum / logsCount) : (0);
};

DeviceSchema.methods.generateAnalytics = async function(stduid){
    const today = new Date();
    const lastMonth = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate());
    const lastWeekStart = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 6);
    const lastDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() - 1);
    const filter = {
        name: {
            $gte: lastMonth.toISOString().substring(0, 10),
            $lte: today.toISOString().substring(0, 10)
        },
        stduid
    };
    
    const partitions = await mongoose.model('DeviceLogPartition')
        .find(filter)
        .select('_id name logs')
        .populate({
            path: 'logs',
            select: 'usagePercentage createdAt'
        })
        .lean();

    const lastMonthUsage = getAverageUsagePercentage(partitions, lastMonth, today);
    const lastWeekUsage = getAverageUsagePercentage(partitions, lastWeekStart, today);
    const lastDayUsage = getAverageUsagePercentage(partitions, lastDay, today);
    const hourlyUsage = getAverageUsagePercentage(
        partitions,
        new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours()),
        new Date(today.getFullYear(), today.getMonth(), today.getDate(), today.getHours() + 1)
    );
    return {
        lastMonthUsage,
        lastWeekUsage,
        lastDayUsage,
        hourlyUsage
    };
};

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;