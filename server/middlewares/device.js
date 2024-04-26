const DeviceLogPartition = require('@models/deviceLogPartition');
const Device = require('@models/device');

exports.processDeviceLog = async (doc) => {
    await Device.updateOne({ stduid: this.stduid }, {
        $push: { logs: doc }
    });

    const { createdAt } = doc;
    const year = createdAt.getFullYear();
    const month = String(createdAt.getMonth() + 1).padStart(2, '0');
    const day = String(createdAt.getDay()).padStart(2, '0');
    const partitionName = `${year}-${day}-${month}`;
    await DeviceLogPartition.updateOne({
        name: partitionName
    }, {
        $setOnInsert: { name: partitionName },
        $push: { logs: doc }
    }, { upsert: true });
};

module.exports = exports;