import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi';
import { CircularProgress } from '@mui/material';
import './Button.css';

const Button = ({ title, isLoading = false, ...props }) => {

    return (
        <button className='Button' {...props}>
            <span>{title}</span>
            <i className='Icon-Container'>
                {(isLoading) ? (
                    <CircularProgress />
                ) : (
                    <HiOutlineArrowRight />
                )}
            </i>
        </button>
    );
};

export default Button;