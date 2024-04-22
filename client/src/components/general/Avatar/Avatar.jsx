import React from 'react';
import './Avatar.css';

const Avatar = ({ title }) => {
    return (
        <div className='Avatar-Container'>
            <h4 className='Avatar-Char'>{title[0]}</h4>
        </div>
    );
};

export default Avatar;