const { getUserByToken } = require('@middlewares/authentication');
const mqttClient = require('@utilities/mqttConnector');
const RuntimeError = require('@utilities/runtimeError');
const Device = require('@models/device');

/**
 * Authenticates user based on provided token.
 * @param {import('socket.io').Socket} socket - Socket.IO socket object.
 * @param {import('socket.io').NextFunction} next - Socket.IO next function.
*/
const userAuthentication = async (socket, next) => {
    const { token } = socket.handshake.auth;
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
 * Verifies user ownership of the requested device.
 * @param {import('socket.io').Socket} socket - Socket.IO socket object.
 * @param {import('socket.io').NextFunction} next - Socket.IO next function.
*/
const tokenOwnership = async (socket, next) => {
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

const deviceMeasurementHandler = (socket) => {
    mqttClient.addHandler((topicName, { measuredDistance }) => {
        if(topicName !== socket.device.stduid) return;
        socket.emit('distance', measuredDistance)
    });
};

module.exports = (io) => {
    io.use(userAuthentication);
    io.on('connection', async (socket) => {
        const { action } = socket.handshake.query;
        if(action === 'Device::Measurement'){
            await tokenOwnership(socket, (error) => {
                if(error){
                    console.log('[SmartTrash Cloud Server]: Critical Error (@controllers/wsController)', error);
                }else{
                    deviceMeasurementHandler(socket);
                }
            });
        }else{
            socket.disconnect();
        }
    });
};