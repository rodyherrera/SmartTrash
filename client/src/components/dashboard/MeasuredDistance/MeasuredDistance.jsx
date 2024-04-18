import React, { useEffect, useState } from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { getCurrentUserToken } from '@services/authentication/localStorageService';
import { useNavigate } from 'react-router-dom';
import { PiDotsThreeVertical } from "react-icons/pi";
import { io } from 'socket.io-client';
import { useSelector } from 'react-redux';
import './MeasuredDistance.css';
  
const MeasuredDistance = ({ setUsagePercentage }) => {
    const [distance, setDistance] = useState(0);
    const { devices } = useSelector((state) => state.device);
    const navigate = useNavigate();

    // TODO: avoid duplicated code @pages/protected/CalibrateDevice
    useEffect(() => {
        if(!devices?.length) return;
        const authToken = getCurrentUserToken();
        const newSocket = io(import.meta.env.VITE_SERVER, {
            transports: ['websocket'],
            auth: { token: authToken },
            query: {
                action: 'Device::Measurement',
                deviceId: devices[0]._id
            }
        });
        newSocket.on('data', ({ measuredDistance, usagePercentage }) => {
            setDistance(measuredDistance);
            setUsagePercentage(usagePercentage);
        });
        return () => {
            newSocket.disconnect();
            setDistance(0);
        };
    }, [devices]);

    return (
        <div className='Device-Measured-Distance-Container'>
            <div className='Device-Measured-Distance-Header-Container'>
                <h3 className='Device-Measured-Distance-Title'>/Measured Distance</h3>
                <i className='Device-Measured-Distance-Help-Icon-Container'>
                    <PiDotsThreeVertical />
                </i>
            </div>
            <div className='Device-Measured-Distance-Footer-Container'>
                <div className='Device-Measured-Distance-Value-Container'>
                    <h3 className='Device-Measured-Distance'>{distance}</h3>
                    <p className='Device-Measured-Distance-Unit'>cm</p>
                </div>
                <button className='Dashboard-Button' onClick={() => navigate('/device/calibrate/')}>
                    <span>Calibrate</span>
                    <i className='Dashboard-Button-Icon-Container'>
                        <HiOutlineArrowRight />
                    </i>
                </button>
            </div>
        </div>
    )
};

export default MeasuredDistance;