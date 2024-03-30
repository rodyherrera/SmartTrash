import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { FiWifiOff, FiWifi } from 'react-icons/fi';
import { isESPConnectedToWiFi } from '@services/network/operations';
import './CurrentWiFiConnection.css';

const CurrentWiFiConnection = () => {
    const dispatch = useDispatch();
    const { isConnectedToWiFi, isConnectedToWiFiLoading } = useSelector((state) => state.network);

    useEffect(() => {
        dispatch(isESPConnectedToWiFi());
    }, []);

    return (
        <div className='Current-WiFi-Connection-Container'>
            <div className='Current-WiFi-Connection-Icon-Container'>
                {(isConnectedToWiFiLoading) ? (
                    <CircularProgress />
                ) : (
                    (isConnectedToWiFi?.ssid) && <FiWifi /> 
                )}
            </div>
            <div className='Current-WiFi-Connection-Content-Container'>
                {(isConnectedToWiFi?.ssid) ? (
                    <p className='Current-WiFi-Connection-Content'>{isConnectedToWiFi.ssid}</p>
                ) : (
                    <FiWifiOff />
                )}    
            </div>
        </div>
    );
};

export default CurrentWiFiConnection;