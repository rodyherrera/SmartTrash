import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { SlClose } from 'react-icons/sl';
import { useNavigate } from 'react-router-dom';
import { deleteCurrentWiFiNetwork } from '@services/network/operations';
import { useDispatch, useSelector } from 'react-redux';
import { CircularProgress } from '@mui/material';
import './WiFiConnectionCard.css';

const WiFiConnectionCard = ({ ssid, isCurrent }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { isCurrentWiFiRemoveLoading } = useSelector((state) => state.network);

    const onClickHandler = () => {
        if(isCurrent){
            dispatch(deleteCurrentWiFiNetwork(navigate));
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
                        (isCurrent) ? <SlClose /> : <HiOutlineArrowRight />
                    )}
                </i>
            </div>
        </div>
    );
};

export default WiFiConnectionCard;