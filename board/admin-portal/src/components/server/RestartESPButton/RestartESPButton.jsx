import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { restartESP } from '@services/server/operations';
import { CircularProgress } from '@mui/material';
import './RestartESPButton.css';

const RestartESPButton = () => {
    const dispatch = useDispatch();
    const { isRestartingLoading } = useSelector((state) => state.server);

    const onClickHandler = () => {
        dispatch(restartESP());
    };

    return (
        <div className='Restart-ESP-Button-Container' onClick={onClickHandler}>
            {isRestartingLoading && (
                <CircularProgress />
            )}
            <p className='Restart-ESP-Button-Title'>Restart</p>
        </div>
    );
};

export default RestartESPButton;