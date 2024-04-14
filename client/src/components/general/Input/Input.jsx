import React from 'react';
import { CircularProgress } from '@mui/material';
import './Input.css';

const Input = ({ isLoading, helperText, error, RightIcon, submitHandler = () => {}, variant = '', ...props }, ref) => {
    const keyPressHandler = (e) => {
        if(e.key === 'Enter'){
            submitHandler();
        }
    };

    return (
        <div className={'Input-Container '.concat((error) ? 'Error' : '') + variant} ref={ref}>
            <div className='Input-Node-Container'>
                <input type='text' onKeyUp={keyPressHandler} {...props} />
                {(RightIcon || isLoading) && (
                    <i className='Input-Right-Icon-Container' onClick={submitHandler}>
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <RightIcon />
                        )}
                    </i>
                )}
            </div>
            {(helperText || error?.length) && (
                <p className='Input-Helper-Text'>{error ? error : helperText}</p>
            )}
        </div>
    );
};

export default React.forwardRef(Input);