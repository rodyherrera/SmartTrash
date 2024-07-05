import React from 'react';
import { HiOutlineArrowUpRight } from 'react-icons/hi2';
import './StatCard.css';

const StatCard = ({ Icon, title, content, ...props }) => {

    return (
        <div className='Stat-Card-Container' {...props}>
            <div className='Stat-Card-Header-Container'>
                <i className='Stat-Card-Header-Icon-Container'>
                    <Icon />
                </i>
                <p className='Stat-Card-Header-Title'>{title}</p>
            </div>
            <div className='Stat-Card-Bottom-Container'>
                <h3 className='Stat-Card-Content'>{content}</h3>
                <i className='Stat-Card-Arrow-Icon'>
                    <HiOutlineArrowUpRight />
                </i>
            </div>
        </div>
    );
};

export default StatCard;