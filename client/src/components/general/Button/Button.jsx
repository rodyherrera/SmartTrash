import React from 'react';
import { CircularProgress } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import './Button.css';

const Button = ({ IconRight, isLoading, children, to, variant = '', ...props }, ref) => {
    const navigate = useNavigate();

    const clickHandler = (e) => {
        if(to){
            navigate(to);
            return;
        }
        props?.onClick?.(e);
    };

    return (
        <button className={'Button-Container '.concat(variant)} onClick={clickHandler} ref={ref}>
            <span className='Button-Title'>{children}</span>
            {(IconRight || isLoading) && (
                <i className='Button-Icon-Right-Container'>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <IconRight />
                    )}
                </i>
            )}
        </button>
    );
};

export default React.forwardRef(Button);