import React from 'react';
import './Input.css';

const Input = ({ helperText, ...props }, ref) => {
    return (
        <div className='Input-Container' ref={ref}>
            <div className='Input-Node-Container'>
                <input type='text' {...props} />
            </div>
            {helperText && (
                <p className='Input-Helper-Text'>{helperText}</p>
            )}
        </div>
    );
};

export default React.forwardRef(Input);