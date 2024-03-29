import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import './WiFiConnectionCard.css';

const WiFiConnectionCard = ({ ssid }) => {

    return (
        <div className='WiFi-SSID-Container'>
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