import React from 'react';
import { useNavigate } from 'react-router-dom';
import './Button.css';

const Button = ({ IconRight, children, to, variant = '', ...props }) => {
    const navigate = useNavigate();

    const clickHandler = (e) => {
        if(to){
            navigate(to);
            return;
        }
        props?.onClick?.(e);
    };

    return (
        <button className={'Button-Container '.concat(variant)} onClick={clickHandler}>
            <span className='Button-Title'>{children}</span>
            {IconRight && (
                <i className='Button-Icon-Right-Container'>
                    <IconRight />
                </i>
            )}
        </button>
    );
};

export default Button;