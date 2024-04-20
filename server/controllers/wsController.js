const { getUserByToken } = require('@middlewares/authentication');
const mqttClient = require('@utilities/mqttClient');
const RuntimeError = require('@utilities/runtimeError');
const Device = require('@models/device');

/**
 * Authenticates a user using a provided token.
 *
 * @param {import('socket.io').Socket} socket - Socket.IO socket object.
 * @param {import('socket.io').NextFunction} next - Socket.IO next function.
 * @returns {Promise<void>}
*/
const authenticateUser = async (socket, next) => {
    const { token } = socket.handshake.query;
    if(!token) return next(new RuntimeError('Authentication::Token::Required'));
    try{
        const user = await getUserByToken(token, next);
        socket.user = user;
        next();
    }catch(error){
        next(error);
    }
};

/**
 * Verifies a user's ownership of a device.
 *
 * @param {import('socket.io').Socket} socket - Socket.IO socket object.
 * @param {import('socket.io').NextFunction} next - Socket.IO next function.
 * @returns {Promise<void>}
*/
const verifyDeviceOwnership = async (socket, next) => {
    const { deviceId } = socket.handshake.query;
    if(!deviceId) return next(new RuntimeError('Device::Id::Required'));
    try{
        const device = await Device.findOne({ _id: deviceId, users: socket.user._id });
        if(!device) return next(new RuntimeError('Device::Not::Found'));
        socket.device = device;
        next();
    }catch(error){
        next(error);
    }
};

/**
 * Handles device measurement data from MQTT.
 *
 * @param {import('socket.io').Socket} socket - Socket.IO socket object.
*/
const handleDeviceMeasurement = (socket) => {
    const { topicName } = socket.device;
    const callback = (data) => {
        socket.emit('data', data);
    };
    mqttClient.addHandler(socket.id, { topicName }, callback);
    socket.on('disconnect', () => {
        mqttClient.deleteHandler(socket.id);
    });
};

module.exports = (io) => {
    // Use authentication middleware for authentication
    io.use(authenticateUser);
    io.on('connection', async (socket) => {
        const { action } = socket.handshake.query;
        if(action === 'Device::Measurement'){
            // Enforce device ownership before handling measurements
            await verifyDeviceOwnership(socket, (error) => {
                if(error){
                    console.log('[SmartTrash Cloud]: Critical Error (@controllers/wsController)', error);
                }else{
                    handleDeviceMeasurement(socket);
                }
            });
        }else{
            socket.disconnect();
        }
    });
};