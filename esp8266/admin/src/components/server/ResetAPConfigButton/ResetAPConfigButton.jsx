import React from 'react';
import { useDispatch } from 'react-redux';
import { resetAPConfig } from '@services/server/operations';
import './ResetAPConfigButton.css';

const ResetAPConfigButton = () => {
    const dispatch = useDispatch();

    const onClickHandler = () => {
        dispatch(resetAPConfig());
    };
    
    return (
        <div className='Reset-AP-Config-Button-Container' onClick={onClickHandler}>
            <p className='Reset-AP-Config-Button-Title'>Reset AP Config</p>
        </div>
    );
};

export default ResetAPConfigButton;