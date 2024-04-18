import { useEffect, useState } from 'react';
import { getCurrentUserToken } from '@services/authentication/localStorageService';
import io from 'socket.io-client';

const useDeviceMeasurement = (deviceId) => {
    const [distance, setDistance] = useState(0);
    const [usagePercentage, setUsagePercentage] = useState(0);

    useEffect(() => {
        if(!deviceId) return;
        const authToken = getCurrentUserToken();
        const socket = io(import.meta.env.VITE_SERVER, {
            transports: ['websocket'],
            auth: { token: authToken },
            query: {
                action: 'Device::Measurement',
                deviceId: deviceId
            }   
        });
        socket.on('data', ({ measuredDistance, usagePercentage }) => {
            setDistance(measuredDistance);
            setUsagePercentage(usagePercentage);
        });
    }, [deviceId]);

    return { distance, usagePercentage };
};

export default useDeviceMeasurement;