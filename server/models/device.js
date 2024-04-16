const mongoose = require('mongoose');

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
    logs: [{
        distance: {
            type: Number,
            required: true
        },
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

DeviceSchema.index({ name: 'text' });
DeviceSchema.index({ stduid: 1, user: 1 }, { unique: true });

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;