import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { FiWifiOff, FiWifi } from 'react-icons/fi';
import { isESPConnectedToWiFi } from '@services/network/operations';
import Button from '@components/general/Button';
import './CurrentWiFiConnection.css';

const CurrentWiFiConnection = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { isConnectedToWiFi, isConnectedToWiFiLoading } = useSelector((state) => state.network);

    useEffect(() => {
        dispatch(isESPConnectedToWiFi());
    }, []);

    const onClickHandler = () => {
        if(!isConnectedToWiFi?.ssid) return;
        navigate('/wifi/current-network/');
    };

    return (
        <div className='Current-WiFi-Connection-Container' onClick={onClickHandler}>
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