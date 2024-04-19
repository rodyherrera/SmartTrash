const mongoose = require('mongoose');

const DeviceLogSchema = new mongoose.Schema({
    stduid: {
        type: String,
        ref: 'Device',
        required: true
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

DeviceLogSchema.pre('save', async function(next){
    try{
        await mongoose.model('Device').updateOne({ stduid: this.stduid }, {
            $push: { logs: this._id }
        });
        next();
    }catch(error){
        console.error('[SmartTrash Cloud Server]: Error updating Device logs:', error);
        next(error);
    }
});

const DeviceLog = mongoose.model('DeviceLog', DeviceLogSchema);

module.exports = DeviceLog;