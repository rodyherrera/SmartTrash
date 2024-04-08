import React from 'react';
import { useDispatch } from 'react-redux';
import { restartESP } from '@services/server/operations';
import './RestartESPButton.css';

const RestartESPButton = () => {
    const dispatch = useDispatch();

    const onClickHandler = () => {
        dispatch(restartESP());
    };

    return (
        <div className='Restart-ESP-Button-Container' onClick={onClickHandler}>
            <p className='Restart-ESP-Button-Title'>Restart Device</p>
        </div>
    );
};

export default RestartESPButton;