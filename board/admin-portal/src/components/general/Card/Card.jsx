import React from 'react';
import { useNavigate } from 'react-router-dom';
import { HiOutlineArrowRight } from 'react-icons/hi2';
import './Card.css';

const Card = ({ Icon, title, to }) => {
    const navigate = useNavigate();

    const onClickHandler = () => {
        if(!to) return;
        navigate(to);
    };

    return (
        <div className='Card-Container' onClick={onClickHandler}>
            <div className='Card-Header-Container'>
                <div className='Card-Header-Icon-Container'>
                    <Icon />
                </div>
            </div>

            <div className='Card-Footer-Container'>
                <div className='Card-Footer-Title-Container'>
                    <h3 className='Card-Footer-Title'>{title}</h3>
                </div>
                <i className='Card-Footer-Arrow-Container'>
                    <HiOutlineArrowRight />
                </i>
            </div>
        </div>
    );
};

export default Card;