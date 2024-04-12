import React from 'react';
import './Input.css';

const Input = ({ helperText, ...props }) => {
    return (
        <div className='Input-Container'>
            <div className='Input-Node-Container'>
                <input type='text' {...props} />
            </div>
            {helperText && (
                <p className='Input-Helper-Text'>{helperText}</p>
            )}
        </div>
    );
};

export default Input;