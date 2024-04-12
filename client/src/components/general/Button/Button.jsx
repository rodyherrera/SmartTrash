import React from 'react';
import './Button.css';

const Button = ({ children, variant = '' }) => {
    return (
        <button className={'Button-Container '.concat(variant)}>
            <span className='Button-Title'>{children}</span>
        </button>
    );
};

export default Button;