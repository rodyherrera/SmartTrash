import React from 'react';
import './Input.css';

const Input = (props) => {

    return (
        <div className='Input-Container'>
            <input 
                className='Input'
                type='text'
                {...props}
            />
        </div>
    );
};

export default Input;