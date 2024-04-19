const mongoose = require('mongoose');
const ARIMA = require('arima');

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
        type: mongoose.Schema.Types.ObjectId,
        ref: 'DeviceLog'
    }],
    createdAt: {
        type: Date,
        default: Date.now()
    }
});

DeviceSchema.index({ name: 'text' });
DeviceSchema.index({ stduid: 1 }, { unique: true });

/**
 * Gets a start and end date range based on a selected type.
 * 
 * @param {string} type - The type of range.  Valid values are 'hourly', 'daily', 'weekly', 'monthly'.
 * @returns {object} An object with `start` and `end` properties representing the date range.
 * @throws {Error} If an invalid `type` is provided.
*/
const getDateRange = (type) => {
    const today = new Date();
    let start, end;
    switch(type){
        case 'hourly':
            start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            break;
        case 'daily':
            start = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            end = new Date(start.getTime() + 24 * 60 * 60 * 1000);
            break;
        case 'weekly':
            start = new Date(today.getFullYear(), today.getMonth(), today.getDate() - (today.getDay() + 1) % 7);
            end = new Date(start.getTime() + 6 * 24 * 60 * 60 * 1000);
            break;
        case 'monthly':  
            start = new Date(today.getFullYear(), today.getMonth(), 1);
            end = new Date(start.getTime() + 31 * 24 * 60 * 60 * 1000);
            break;
        default:
            throw new Error('Invalid range type');
    }
    return { start, end };
};

/**
 * Calculates the average device usage over a specified timeframe.
 * 
 * @param {string} type - The timeframe type (default: 'daily'). Valid options: 'hourly', 'daily', 'weekly', 'monthly'
 * @returns {number} The rounded average usage percentage.
*/
DeviceSchema.methods.getAverageUsage = async function(type = 'daily'){
    const { start, end } = getDateRange(type);
    const deviceLogs = await this.model('DeviceLog').find({
        stduid: this.stduid,
        createdAt: { $gte: start, $lt: end }
    });
    if(deviceLogs.length === 0){
        return 0;
    }
    const totalUsage = deviceLogs.reduce((sum, log) => sum + log.usagePercentage, 0);
    const averageUsage = Math.round(totalUsage / deviceLogs.length);
    return averageUsage;
};

/**
 * Calculates hourly device usage over a specified timeframe.
 *
 * @param {string} type - The timeframe type (default: 'daily'). Valid options: 'hourly', 'daily', 'weekly', 'monthly'
 * @returns {object} An object with properties representing hours (0-23), with average usage percentage for each.
*/
DeviceSchema.methods.getHourlyUsage = async function(type = 'daily'){
    const { start, end } = getDateRange(type);
    const deviceLogs = await this.model('DeviceLog').find({
        stduid: this.stduid,
        createdAt: { $gte: start, $lt: end } 
    });
    const hourlyUsage = {};
    for(const log of deviceLogs){
        const hour = new Date(log.createdAt).getHours();
        if(!hourlyUsage[hour]){
            hourlyUsage[hour] = 0; 
        }
        hourlyUsage[hour] += log.usagePercentage; 
    }
    for(const hour in hourlyUsage){
        hourlyUsage[hour] = Math.round(hourlyUsage[hour] / deviceLogs.length); 
    }
    return hourlyUsage;
};

/**
 * Predicts future device usage based on historical data using the ARIMA model.
 *
 * @param {string} type - The timeframe for historical data (default: 'hourly'). Valid options: 'hourly', 'daily', 'weekly', 'monthly'
 * @param {number} numFutureValues - The number of future values to predict (default: 2).
 * @returns {array} An array of predicted usage values.
*/
DeviceSchema.methods.predictFutureUsage = async function(type = 'hourly', numFutureValues = 2){
    const historicalData = await this.getHistoricalUsage(type);
    const autoarima = new ARIMA({ auto: true, verbose: false });
    autoarima.train(historicalData);
    const futureValues = autoarima.predict(numFutureValues); 
    const predictions = futureValues[0]; 
    return predictions;
};

/**
 * Retrieves historical usage data for a device over a specified timeframe.
 *
 * @param {string} type - The timeframe type (default: 'daily'). Valid options: 'hourly', 'daily', 'weekly', 'monthly'
 * @returns {array} An array of device usage percentages over the timeframe.
*/
DeviceSchema.methods.getHistoricalUsage = async function(type = 'daily'){
    const { start, end } = getDateRange(type);
    const deviceLogs = await this.model('DeviceLog').find({
        stduid: this.stduid,
        createdAt: { $gte: start, $lt: end }
    });
    const historicalData = deviceLogs.map(log => log.usagePercentage);
    return historicalData;
};

const Device = mongoose.model('Device', DeviceSchema);

module.exports = Device;