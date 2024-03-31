import React from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import { CircularProgress } from '@mui/material';
import './RectangleCard.css';

const RectangleCard = ({ title, isLoading, ...props }) => {

    return (
        <div className='Rectangle-Card-Container' {...props}>
            <div className='Rectangle-Card-Title-Container'>
                <h4 className='Rectangle-Card-Title'>{title}</h4>
            </div>
            <div className='Rectangle-Card-Icon-Container'>
                {(isLoading) ? (
                    <CircularProgress />
                ) : (
                    <HiOutlineArrowRight />
                )}
            </div>
        </div>
    );
};

export default RectangleCard;