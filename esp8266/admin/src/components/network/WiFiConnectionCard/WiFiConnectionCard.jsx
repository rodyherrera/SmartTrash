import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import './WiFiConnectionCard.css';

const WiFiConnectionCard = ({ ssid, isCurrent }) => {
    const navigate = useNavigate();
    const { isCurrentWiFiRemoveLoading } = useSelector((state) => state.network);

    const onClickHandler = () => {
        if(isCurrent){
            navigate('/wifi/current-network/');
            return;
        }
        navigate('/wifi/setup-network?ssid=' + ssid);
    };

    return (
        <div className='WiFi-SSID-Container' onClick={onClickHandler}>
            <div className='WiFi-Info-Container'>
                <h4 className='WiFi-SSID'>{ssid}</h4>
                {(isCurrent) && (
                    <div className='WiFi-IsCurrent-Container'>
                        <p className='WiFi-IsCurrent'>Current Connection</p>
                    </div>
                )}
            </div>

            <div className='WiFi-Actions-Container'>
                <i className='WiFi-Arrow-Right-Container'>
                    {isCurrentWiFiRemoveLoading ? (
                        <CircularProgress />
                    ) : (
                        <HiOutlineArrowRight />
                    )}
                </i>
            </div>
        </div>
    );
};

export default WiFiConnectionCard;