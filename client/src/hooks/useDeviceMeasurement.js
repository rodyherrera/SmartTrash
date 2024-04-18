import { useEffect, useState, useRef } from 'react';
import { getCurrentUserToken } from '@services/authentication/localStorageService';
import io from 'socket.io-client';

const useDeviceMeasurement = (deviceId) => {
    const [distance, setDistance] = useState(0);
    const [usagePercentage, setUsagePercentage] = useState(0);
    const socketRef = useRef(null);

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
        socketRef.current = socket; // Store the reference
        return () => {
            socket.current.disconnect();
        };
    }, [deviceId]);

    return { distance, usagePercentage };
};

export default useDeviceMeasurement;