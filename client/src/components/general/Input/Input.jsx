import React from 'react';
import './Input.css';

const Input = ({ helperText, error, variant = '', RightIcon, ...props }, ref) => {
    return (
        <div className={'Input-Container '.concat((error) ? 'Error' : '') + variant} ref={ref}>
            <div className='Input-Node-Container'>
                <input type='text' {...props} />
                {(RightIcon) && (
                    <i className='Input-Right-Icon-Container'>
                        <RightIcon />
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