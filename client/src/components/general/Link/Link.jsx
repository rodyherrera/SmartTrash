import React from 'react';
import './Link.css';

const Link = ({ title }) => {
    return (
        <a href='/' className='Link-Container'>
            <span className='Link-Container-Title'>{title}</span>
        </a>
    );
};

export default Link;