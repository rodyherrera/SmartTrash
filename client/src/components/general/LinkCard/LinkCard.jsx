import React from 'react';
import { GoArrowRight } from 'react-icons/go';
import './LinkCard.css';

const LinkCard = ({ topic, title }, ref) => {

    return (
        <div className='Link-Card-Container' ref={ref}>
            <p className='Link-Card-Topic'>{topic}</p>
            <h3 className='Link-Card-Title'>{title}</h3>
            <i className='Link-Card-Arrow-Container'>
                <GoArrowRight />
            </i>
        </div>
    );
};

export default React.forwardRef(LinkCard);