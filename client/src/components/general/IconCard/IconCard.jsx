import React from 'react';
import './IconCard.css';

const IconCard = ({ Icon, title, description }, ref) => {
    return (
        <div className='Icon-Card-Container' ref={ref}>
            <div className='Icon-Card-Icon-Container'>
                <Icon />
            </div>
            <div className='Icon-Card-Content-Container'>
                <h3 className='Icon-Card-Title'>{title}</h3>
                <p className='Icon-Card-Description'>{description}</p>
            </div>
        </div>
    );
};

export default React.forwardRef(IconCard);