const mongoose = require('mongoose');
const { processDeviceLog } = require('@middlewares/device');

const DeviceLogSchema = new mongoose.Schema({
    stduid: {
        type: String,
        ref: 'Device',
        required: true
    },
    timePartition: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'deviceLogPartition'
    },
    distance: {
        type: Number,
        required: true
    },
    usagePercentage: {
        type: Number,
        default: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

DeviceLogSchema.index({ stduid: 1, createdAt: 1 });

DeviceLogSchema.post('save', async function(doc){
    try{
        await processDeviceLog(doc);
    }catch(error){
        console.log('[SmartTrash Cloud]: (deviceLog - post save middleware)', error);
    }
});

const DeviceLog = mongoose.model('DeviceLog', DeviceLogSchema);

module.exports = DeviceLog;