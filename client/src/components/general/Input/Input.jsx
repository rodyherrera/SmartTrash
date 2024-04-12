import React from 'react';
import './Input.css';

const Input = ({ helperText, error, ...props }, ref) => {
    return (
        <div className={'Input-Container '.concat((error) ? 'Error' : '')} ref={ref}>
            <div className='Input-Node-Container'>
                <input type='text' {...props} />
            </div>
            {(helperText || error?.length) && (
                <p className='Input-Helper-Text'>{error ? error : helperText}</p>
            )}
        </div>
    );
};

export default React.forwardRef(Input);