import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { useNavigate } from 'react-router-dom';
import './WiFiConnectionCard.css';

const WiFiConnectionCard = ({ ssid }) => {
    const navigate = useNavigate();

    const onClickHandler = () => {
        navigate('/wifi/setup-network?ssid=' + ssid);
    };

    return (
        <div className='WiFi-SSID-Container' onClick={onClickHandler}>
            <h4 className='WiFi-SSID'>{ssid}</h4>

            <div className='WiFi-Actions-Container'>
                <i className='WiFi-Arrow-Right-Container'>
                    <HiOutlineArrowRight />
                </i>
            </div>
        </div>
    );
};

export default WiFiConnectionCard;