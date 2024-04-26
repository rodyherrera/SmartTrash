const mongoose = require('mongoose');

const DeviceLogPartitionSchema = new mongoose.Schema({
    name: {
        type: String,
        maxlength: [32, 'DeviceLogPartition::Name'],
        required: [true, 'DeviceLogPartition::Required'],
        trim: true,
        unique: true
    },
    logs: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeviceLog'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

DeviceLogPartitionSchema.index({ name: 'text' });

const DeviceLogPartition = mongoose.model('DeviceLogPartition', DeviceLogPartitionSchema);

module.exports = DeviceLogPartition;